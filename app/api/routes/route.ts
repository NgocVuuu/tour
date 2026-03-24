import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Route from '@/lib/models/Route';

export async function GET() {
  try {
    await connectDB();
    const routes = await Route.find({ isActive: true })
      .select('slug name basePrice duration images highlights')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: routes });
  } catch (error) {
    console.warn('[GET /api/routes] Database connection failed or timeout. Returning empty data to trigger frontend fallbacks.');
    return NextResponse.json({ success: true, data: [] });
  }
}
