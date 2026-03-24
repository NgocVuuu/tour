'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCurrency } from '@/lib/context/CurrencyContext';
import { HeaderAuth } from '@/components/HeaderAuth';

interface Route {
  _id: string;
  slug: string;
  name: string;
  basePrice: number;
  duration: string;
  images: string[];
}

export default function RoutesListingPage() {
  const { format } = useCurrency();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/routes`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setRoutes(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fallbackRoutes = [
    { 
      _id: '1', slug: 'danang-airport-to-hoi-an', name: 'Da Nang Airport to Hoi An', basePrice: 25, duration: '45 mins', 
      images: [
        'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=800&q=80',
        'https://images.unsplash.com/photo-1542401886-65d27afda266?w=800&q=80',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'
      ] 
    },
    { 
      _id: '2', slug: 'danang-to-ba-na-hills', name: 'Da Nang to Ba Na Hills', basePrice: 35, duration: '1 hour', 
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
        'https://images.unsplash.com/photo-1488390671519-ce21cc028cb4?w=800&q=80'
      ] 
    },
    { 
      _id: '3', slug: 'hoi-an-to-danang-airport', name: 'Hoi An to Da Nang Airport', basePrice: 25, duration: '45 mins', 
      images: [
        'https://images.unsplash.com/photo-1504681869696-d977211867ff?w=800&q=80',
        'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=800&q=80',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'
      ] 
    },
  ];

  const displayRoutes = routes.length > 0 ? routes : fallbackRoutes;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">Thuê Xe Đà Nẵng</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-orange-500">Trang Chủ</Link>
            <Link href="/routes" className="text-orange-500">Bảng Giá</Link>
            <HeaderAuth />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gray-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Danh Sách Tuyến Xe & Bảng Giá</h1>
        <p className="text-gray-300 max-w-xl mx-auto">
          Khám phá các dịch vụ xe riêng tư, chất lượng cao với mức giá cố định, minh bạch trên toàn Miền Trung.
        </p>
      </div>

      {/* Posts Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayRoutes.map((route) => (
              <Link key={route._id} href={`/routes/${route.slug}`}>
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition border border-gray-200 cursor-pointer h-full flex flex-col">
                  <div className="relative h-48 w-full">
                    <Image
                      src={route.images[0] || 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=800&q=80'}
                      alt={route.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex-1">{route.name}</h3>
                    <div className="flex gap-2 mb-3">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        Xe Chuyên Cơ Tương Đương
                      </span>
                      {route.duration && (
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {route.duration}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 mt-auto">
                      <span className="text-lg font-bold text-orange-500">
                        Từ {format(route.basePrice)} / xe
                      </span>
                      <ChevronRight className="w-5 h-5 text-orange-500" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
