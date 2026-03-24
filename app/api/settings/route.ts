import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';

export async function GET() {
  try {
    await connectDB();

    // Chỉ trả về exchange rates (không expose Telegram/Payoneer credentials)
    const settings = await Settings.findOne().select('exchangeRates whatsappNumber').lean();

    // Nếu chưa có settings, trả về defaults
    const data = settings || {
      exchangeRates: { USD: 1, EUR: 0.92, AUD: 1.58 },
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[GET /api/settings]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}
