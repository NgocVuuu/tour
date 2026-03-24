import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();

    const booking = await Booking.findByIdAndUpdate(params.id, body, { new: true });
    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error('[PUT /api/admin/bookings/[id]]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const booking = await Booking.findByIdAndDelete(params.id);
    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/admin/bookings/[id]]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
