'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Clock, MessageCircle } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { useCurrency } from '@/lib/context/CurrencyContext';
import { HeaderAuth } from '@/components/HeaderAuth';
import { useSearchParams } from 'next/navigation';

interface Route {
  _id: string;
  slug: string;
  name: string;
  basePrice: number;
  duration: string;
  images: string[];
}

function RoutesListingContent() {
  const { format } = useCurrency();
  const searchParams = useSearchParams();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  const pickupSearch = searchParams.get('pickup') || '';
  const dropoffSearch = searchParams.get('dropoff') || '';
  const dateSearch = searchParams.get('date') || '';
  const paxSearch = searchParams.get('pax') || '1';

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
  const hasSearch = pickupSearch || dropoffSearch;

  return (
    <div className="min-h-screen bg-white">


      <div className="bg-gray-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Transfer Routes & Pricing</h1>
        <p className="text-gray-300 max-w-xl mx-auto">
          Explore high-quality private car services with fixed and transparent pricing across Central Vietnam.
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
            
            {/* Custom Route Card (if searched) */}
            {hasSearch && (
              <Link href={`/checkout?routeId=custom&routeName=Xe+Riêng:+${encodeURIComponent(pickupSearch || 'Điểm Đón')}+-+${encodeURIComponent(dropoffSearch || 'Điểm Đến')}&pax=${paxSearch}` + (dateSearch ? `&date=${dateSearch.split('T')[0]}&time=${dateSearch.split('T')[1]}` : '')}>
                <div className="bg-orange-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition border-2 border-orange-400 cursor-pointer h-full flex flex-col relative">
                  <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                    Custom Route
                  </div>
                  <div className="relative h-48 w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=800&q=80"
                      alt="Custom Transfer"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex-1">
                      {pickupSearch || 'Pickup'} ➔ {dropoffSearch || 'Dropoff'}
                    </h3>
                    <div className="flex gap-2 mb-3">
                      <span className="inline-block px-3 py-1 bg-white text-gray-700 text-xs font-medium rounded-full border border-orange-200">
                        Private Vehicle
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-orange-200 mt-auto">
                      <span className="text-lg font-bold text-orange-600 flex items-center gap-1">
                        <MessageCircle className="w-5 h-5" /> Quote Request
                      </span>
                      <ChevronRight className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                </div>
              </Link>
            )}

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
                        Private Vehicle
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
                        From {format(route.basePrice)} / car
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

export default function RoutesListingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" /></div>}>
      <RoutesListingContent />
    </Suspense>
  );
}
