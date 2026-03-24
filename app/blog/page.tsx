'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { HeaderAuth } from '@/components/HeaderAuth';

interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  heroImage: string;
  author: string;
  publishedAt: string;
}

interface Pagination {
  page: number;
  totalPages: number;
  total: number;
}

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/blog?page=${page}&limit=9`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setPosts(d.data);
          setPagination(d.pagination);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  const fallbackPosts = [
    { _id: '1', slug: 'danang-airport-hoi-an', title: 'The Ultimate Guide: Da Nang Airport to Hoi An in 2026', excerpt: 'Everything you need to know about getting from Da Nang Airport to Hoi An Ancient Town.', heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop', author: 'Admin', publishedAt: '2026-03-01' },
    { _id: '2', slug: 'ba-na-hills', title: 'Ba Na Hills Guide: Cable Car & French Village 2026', excerpt: 'Plan the perfect day trip to Ba Na Hills from Da Nang with our comprehensive guide.', heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop', author: 'Admin', publishedAt: '2026-02-15' },
    { _id: '3', slug: 'hoi-an-guide', title: 'Exploring Hoi An: History, Food & Lanterns', excerpt: 'Discover the magic of Hoi An Ancient Town — from lantern-lit streets to world-class cuisine.', heroImage: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=400&h=250&fit=crop', author: 'Admin', publishedAt: '2026-02-01' },
  ];

  const displayPosts = posts.length > 0 ? posts : fallbackPosts;

  return (
    <div className="min-h-screen bg-white">


      {/* Hero */}
      <div className="bg-gray-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Da Nang Travel Guide</h1>
        <p className="text-gray-300 max-w-xl mx-auto">
          Da Nang travel tips, food, culture, and transportation guides.
        </p>
      </div>

      {/* Posts Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayPosts.map((post) => (
                <Link key={post._id} href={`/blog/${post.slug}`}>
                  <article className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer h-full flex flex-col">
                    <div className="relative h-48 w-full">
                      <Image
                        src={post.heroImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop'}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-xs text-gray-500 mb-2">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                        {post.author && ` • ${post.author}`}
                      </p>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2 flex-1">{post.title}</h2>
                      {post.excerpt && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>}
                      <span className="inline-flex items-center text-orange-500 font-medium text-sm mt-auto">
                        Read more <ChevronRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 text-sm"
                >
                  ← Previous Page
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 text-sm"
                >
                  Next Page →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
