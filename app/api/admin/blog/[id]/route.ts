import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';

const UpdateBlogPostSchema = z.object({
  title: z.string().min(1).trim().optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  heroImage: z.string().optional(),
  author: z.string().optional(),
  isPublished: z.boolean().optional(),
  publishedAt: z.string().nullable().optional(),
});

// PUT /api/admin/blog/[id]
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = UpdateBlogPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 422 });
    }

    const { isPublished, publishedAt, ...rest } = parsed.data;
    const updateData: Record<string, unknown> = { ...rest };

    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
      if (isPublished && !publishedAt) {
        updateData.publishedAt = new Date();
      } else if (!isPublished) {
        updateData.publishedAt = null;
      }
    }
    if (publishedAt !== undefined) {
      updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
    }

    await connectDB();
    const post = await BlogPost.findByIdAndUpdate(id, updateData, { new: true }).lean();
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('[PUT /api/admin/blog/[id]]', error);
    return NextResponse.json({ success: false, error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE /api/admin/blog/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const post = await BlogPost.findByIdAndDelete(id);
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    console.error('[DELETE /api/admin/blog/[id]]', error);
    return NextResponse.json({ success: false, error: 'Failed to delete post' }, { status: 500 });
  }
}
