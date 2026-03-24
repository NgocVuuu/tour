'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Calendar, User, Facebook, Twitter, MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, use } from 'react';

interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  heroImage: string;
  author: string;
  metaTitle: string;
  metaDescription: string;
  publishedAt: string | null;
}

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const siteUrl = typeof window !== 'undefined' ? window.location.href : '';
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '84905555555';

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((d) => {
        if (d?.success) setPost(d.data);
        else if (d) setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-2xl font-bold text-gray-900">Article Not Found</h1>
        <p className="text-gray-500">This article may have been moved or deleted.</p>
        <Link href="/blog">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <div className="min-h-screen bg-white">


      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900 transition">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/blog" className="hover:text-gray-900 transition">Travel Guide</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium line-clamp-1">{post.title}</span>
        </nav>

        <article>
          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm mb-8 pb-8 border-b border-gray-200">
            {publishedDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{publishedDate}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
          </div>

          {/* Hero Image */}
          {post.heroImage && (
            <div className="relative w-full h-72 sm:h-96 rounded-lg overflow-hidden mb-10 shadow-md">
              <Image src={post.heroImage} alt={post.title} fill className="object-cover" priority />
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light border-l-4 border-orange-500 pl-4">
              {post.excerpt}
            </p>
          )}

          {/* Article Body — render HTML content từ DB */}
          <div
            className="prose prose-lg max-w-none mb-12
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900
              prose-ul:list-disc prose-ul:pl-6
              prose-li:text-gray-700 prose-li:mb-1
              prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* In-Article CTA */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500 rounded-lg p-8 my-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to book your transfer?</h3>
            <p className="text-gray-700 mb-6">
              High-quality private cars and local drivers. Transparent pricing starting from <span className="font-bold text-orange-500">$25</span>.
            </p>
            <Link href="/">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
                View Transfer Prices
              </Button>
            </Link>
          </div>
        </article>

        {/* Share */}
        <div className="border-t border-gray-200 pt-8 mt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
          <div className="flex gap-3 flex-wrap">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-700 font-medium text-sm">
              <Facebook className="w-4 h-4" /> Facebook
            </a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(post.title)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-700 font-medium text-sm">
              <Twitter className="w-4 h-4" /> Twitter
            </a>
            <a href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + siteUrl)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-700 font-medium text-sm">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/blog" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium transition">
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">© 2026 DaNang Private Transfer. All rights reserved.</p>
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition text-sm">
            <MessageCircle className="w-4 h-4" /> Support via WhatsApp/Zalo
          </a>
        </div>
      </footer>
    </div>
  );
}
