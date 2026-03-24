import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(20, parseInt(searchParams.get('limit') || '9'));
    const skip = (page - 1) * limit;

    await connectDB();

    const [posts, total] = await Promise.all([
      BlogPost.find({ isPublished: true })
        .select('slug title excerpt heroImage author publishedAt createdAt')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments({ isPublished: true }),
    ]);

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.warn('[GET /api/blog] Database connection failed or timeout. Returning empty data to trigger frontend fallbacks.');
    return NextResponse.json({ 
      success: true, 
      data: [],
      pagination: { page: 1, limit: 9, total: 0, totalPages: 1 }
    });
  }
}
