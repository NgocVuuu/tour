import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';

export async function GET() {
  try {
    await connectDB();
    const bookings = await Booking.find()
      .sort({ createdAt: -1 }) // Newest first
      .lean();

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error('[GET /api/admin/bookings]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
