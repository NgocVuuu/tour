import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import Route from '@/lib/models/Route';

const UpdateRouteSchema = z.object({
  name: z.string().min(1).trim().optional(),
  description: z.string().optional(),
  basePrice: z.number().min(0).optional(),
  duration: z.string().optional(),
  images: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  inclusions: z.array(z.string()).optional(),
  exclusions: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

// PUT /api/admin/routes/[id]
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = UpdateRouteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 422 });
    }

    await connectDB();
    const route = await Route.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
    if (!route) {
      return NextResponse.json({ success: false, error: 'Route not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: route });
  } catch (error) {
    console.error('[PUT /api/admin/routes/[id]]', error);
    return NextResponse.json({ success: false, error: 'Failed to update route' }, { status: 500 });
  }
}

// DELETE /api/admin/routes/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const route = await Route.findByIdAndDelete(id);
    if (!route) {
      return NextResponse.json({ success: false, error: 'Route not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Route deleted' });
  } catch (error) {
    console.error('[DELETE /api/admin/routes/[id]]', error);
    return NextResponse.json({ success: false, error: 'Failed to delete route' }, { status: 500 });
  }
}
