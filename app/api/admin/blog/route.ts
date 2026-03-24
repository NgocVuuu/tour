import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';

const BlogPostSchema = z.object({
  slug: z.string().min(1).toLowerCase().trim(),
  title: z.string().min(1).trim(),
  content: z.string().default(''),
  excerpt: z.string().default(''),
  metaTitle: z.string().default(''),
  metaDescription: z.string().default(''),
  heroImage: z.string().default(''),
  author: z.string().default('Admin'),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().optional().nullable(),
});

// GET /api/admin/blog — kể cả draft
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));
    const skip = (page - 1) * limit;

    await connectDB();
    const [posts, total] = await Promise.all([
      BlogPost.find()
        .select('slug title excerpt content heroImage isPublished publishedAt author createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('[GET /api/admin/blog]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST /api/admin/blog — tạo bài mới
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = BlogPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 422 });
    }

    const { publishedAt, isPublished, ...rest } = parsed.data;
    const postData = {
      ...rest,
      isPublished,
      publishedAt: isPublished
        ? publishedAt
          ? new Date(publishedAt)
          : new Date()
        : null,
    };

    await connectDB();
    const post = await BlogPost.create(postData);
    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error: unknown) {
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 });
    }
    console.error('[POST /api/admin/blog]', error);
    return NextResponse.json({ success: false, error: 'Failed to create post' }, { status: 500 });
  }
}
