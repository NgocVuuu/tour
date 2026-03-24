import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import Route from '@/lib/models/Route';

const RouteSchema = z.object({
  slug: z.string().min(1).toLowerCase().trim(),
  name: z.string().min(1).trim(),
  description: z.string().optional().default(''),
  basePrice: z.number().min(0),
  duration: z.string().optional().default(''),
  images: z.array(z.string()).optional().default([]),
  highlights: z.array(z.string()).optional().default([]),
  inclusions: z.array(z.string()).optional().default([]),
  exclusions: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true),
});

// GET /api/admin/routes — tất cả routes (kể cả inactive)
export async function GET() {
  try {
    await connectDB();
    const routes = await Route.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: routes });
  } catch (error) {
    console.error('[GET /api/admin/routes]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch routes' }, { status: 500 });
  }
}

// POST /api/admin/routes — tạo route mới
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RouteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 422 });
    }

    await connectDB();
    const route = await Route.create(parsed.data);
    return NextResponse.json({ success: true, data: route }, { status: 201 });
  } catch (error: unknown) {
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 });
    }
    console.error('[POST /api/admin/routes]', error);
    return NextResponse.json({ success: false, error: 'Failed to create route' }, { status: 500 });
  }
}
