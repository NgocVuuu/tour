import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import Route from '@/lib/models/Route';
import Booking from '@/lib/models/Booking';
import Settings from '@/lib/models/Settings';
import { sendTelegramNotification } from '@/lib/telegram';

// ─── Rate Limiting (in-memory, per IP) ───────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true; // allowed
  }

  if (entry.count >= RATE_LIMIT) return false; // blocked

  entry.count += 1;
  return true; // allowed
}

// ─── Input Validation Schema ──────────────────────────────────────────────────
const BookingSchema = z.object({
  routeId: z.string().min(1, 'Route is required'),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  whatsapp: z.string().min(7, 'WhatsApp number is required'),
  pickupAddress: z.string().min(3, 'Pickup address is required'),
  dropoffAddress: z.string().min(3, 'Dropoff address is required'),
  flightNumber: z.string().optional(),
  notes: z.string().optional(),
  pax: z.number().int().min(1).max(20),
  transferDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date'),
  currency: z.enum(['USD', 'EUR', 'AUD', 'VND']).default('USD'),
  paymentMethod: z.enum(['payoneer', 'cash']),
});

// ─── POST /api/bookings ───────────────────────────────────────────────────────
export async function POST(req: Request) {
  // 1. Rate limiting
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again in 10 minutes.' },
      { status: 429 }
    );
  }

  // 2. Parse & validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = BookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // 3. Connect DB + fetch route & settings (Bước 2: RECALCULATE — không tin FE)
  await connectDB();

  let route: any = null;
  let settings: any = null;

  try {
    settings = await Settings.findOne().lean();
    if (data.routeId === 'custom') {
      route = {
        _id: 'custom',
        name: `Custom Route (Quote Request): ${data.pickupAddress} ➔ ${data.dropoffAddress}`,
        slug: 'custom-route',
        basePrice: 0,
        isActive: true,
      };
    } else {
      route = await Route.findById(data.routeId);
    }
  } catch (err) {
    console.error('Error fetching route/settings:', err);
  }

  if (!route || !route.isActive) {
    return NextResponse.json({ success: false, error: 'Route not found or inactive' }, { status: 404 });
  }

  const exchangeRates = settings?.exchangeRates || { USD: 1, EUR: 0.92, AUD: 1.58, VND: 25000 };
  const exchangeRate = (exchangeRates as any)[data.currency] ?? 1;

  // Business logic: tính số xe và tổng tiền
  const carsRequired = Math.ceil(data.pax / 3);
  const totalPriceUSD = carsRequired * route.basePrice;
  const totalPriceDisplay = parseFloat((totalPriceUSD * exchangeRate).toFixed(2));

  // 4. Save booking to MongoDB (Bước 3: SAVE)
  const booking = await Booking.create({
    routeId: route._id,
    routeName: route.name,
    routeSlug: route.slug,
    customerName: data.customerName,
    email: data.email,
    whatsapp: data.whatsapp,
    pickupAddress: data.pickupAddress,
    dropoffAddress: data.dropoffAddress,
    flightNumber: data.flightNumber,
    notes: data.notes,
    pax: data.pax,
    carsRequired,
    basePrice: route.basePrice,
    totalPriceUSD,
    totalPriceDisplay,
    currency: data.currency,
    exchangeRate,
    paymentMethod: data.paymentMethod,
    transferDate: new Date(data.transferDate),
  });

  // 5. Fire-and-forget Telegram notification — fail-safe
  Promise.allSettled([
    sendTelegramNotification(booking),
  ]).then((results) => {
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`[Notification ${i === 0 ? 'Telegram' : ''} failed]`, r.reason);
      }
    });
  });

  // 6. Return success response
  return NextResponse.json(
    {
      success: true,
      data: {
        bookingCode: booking.bookingCode,
        totalPriceDisplay: booking.totalPriceDisplay,
        currency: booking.currency,
        carsRequired: booking.carsRequired,
      },
    },
    { status: 201 }
  );
}
