import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';

const fallbackPosts: Record<string, any> = {
  'danang-airport-hoi-an': {
    _id: '1', slug: 'danang-airport-hoi-an', title: 'The Ultimate Guide: Da Nang Airport to Hoi An in 2026', 
    excerpt: 'Everything you need to know about getting from Da Nang Airport to Hoi An Ancient Town.', 
    heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop', 
    author: 'Admin', publishedAt: '2026-03-01',
    content: '<p>Traveling from Da Nang Airport to Hoi An is a journey of about 30km and typically takes 45 minutes.</p><p>The most convenient way is booking a private transfer. It offers door-to-door service and english speaking drivers.</p>'
  },
  'ba-na-hills': {
    _id: '2', slug: 'ba-na-hills', title: 'Ba Na Hills Guide: Cable Car & French Village 2026', 
    excerpt: 'Plan the perfect day trip to Ba Na Hills from Da Nang with our comprehensive guide.', 
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop', 
    author: 'Admin', publishedAt: '2026-02-15',
    content: '<p>Ba Na Hills is one of the most famous tourist attractions in Da Nang, featuring the iconic Golden Bridge.</p><p>Getting there early can help you avoid the crowds. A private car will get you to the cable car station comfortably.</p>'
  },
  'hoi-an-guide': {
    _id: '3', slug: 'hoi-an-guide', title: 'Exploring Hoi An: History, Food & Lanterns', 
    excerpt: 'Discover the magic of Hoi An Ancient Town — from lantern-lit streets to world-class cuisine.', 
    heroImage: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=400&h=250&fit=crop', 
    author: 'Admin', publishedAt: '2026-02-01',
    content: '<p>Hoi An is designated as a UNESCO World Heritage site, famous for its exceptionally well-preserved Ancient Town.</p><p>Don\'t miss the local delicacies like Cao Lau and Banh Mi, and enjoy walking under the colorful lanterns at night.</p>'
  }
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    try {
      await connectDB();
      const post = await BlogPost.findOne({ slug, isPublished: true }).lean();
      if (post) {
        return NextResponse.json({ success: true, data: post });
      }
    } catch (dbError) {
      console.error('[MongoDB Error]', dbError);
    }

    // Check fallback posts
    if (fallbackPosts[slug]) {
      return NextResponse.json({ success: true, data: fallbackPosts[slug] });
    }

    return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
  } catch (error) {
    console.error('[GET /api/blog/[slug]]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch post' }, { status: 500 });
  }
}
