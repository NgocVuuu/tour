'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapPin, Clock, Users, Calendar, Star, Check, X, ChevronRight, Home, Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, use } from 'react';
import { useCurrency } from '@/lib/context/CurrencyContext';

interface Route {
  _id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  duration: string;
  images: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
}

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { format, currency } = useCurrency();

  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [passengers, setPassengers] = useState('1');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Pre-fill từ search params nếu khách đến từ homepage widget
  useEffect(() => {
    const pickupParam = searchParams.get('pickup');
    const dropoffParam = searchParams.get('dropoff');
    if (pickupParam) sessionStorage.setItem('pickup', pickupParam);
    if (dropoffParam) sessionStorage.setItem('dropoff', dropoffParam);
  }, [searchParams]);

  useEffect(() => {
    fetch(`/api/routes/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setRoute(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  function handleBookNow() {
    if (!route || !date || !time) return;
    const params = new URLSearchParams({
      routeId: route._id,
      routeSlug: route.slug,
      routeName: route.name,
      pax: passengers,
      date,
      time,
      currency,
    });
    router.push(`/checkout?${params.toString()}`);
  }

  const carsNeeded = Math.ceil(parseInt(passengers) / 3);
  const totalPrice = route ? route.basePrice * carsNeeded : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!route) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Route not found</h1>
        <Link href="/" className="text-orange-500 hover:underline">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
              <Link href="/" className="hover:text-orange-500 flex items-center gap-1">
                <Home className="w-4 h-4" /> Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Routes</span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{route.name}</h1>

            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
                ))}
              </div>
              <span className="font-semibold text-gray-900">4.9</span>
              <span className="text-gray-600">(120 reviews)</span>
              <span className="text-gray-600">• Booked 500+ times</span>
            </div>

            {/* Image Gallery */}
            {route.images.length > 0 && (
              <div className="mb-8">
                <div className="grid grid-cols-3 gap-4 h-80">
                  <div className="col-span-2 relative rounded-lg overflow-hidden">
                    <Image src={route.images[0]} alt={route.name} fill className="object-cover" priority />
                  </div>
                  <div className="flex flex-col gap-4">
                    {route.images.slice(1, 3).map((img, i) => (
                      <div key={i} className="relative rounded-lg overflow-hidden flex-1">
                        <Image src={img} alt={`${route.name} ${i + 2}`} fill className="object-cover" />
                      </div>
                    ))}
                    {route.images.length < 2 && (
                      <div className="relative rounded-lg overflow-hidden flex-1 bg-gray-100" />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Highlights */}
            {route.highlights.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About this activity</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {route.highlights.map((h, i) => (
                    <div key={i} className="flex gap-4">
                      <Check className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{h}</span>
                    </div>
                  ))}
                  {route.duration && (
                    <div className="flex gap-4">
                      <Clock className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Duration: {route.duration}</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Description */}
            {route.description && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience the convenience</h2>
                <p className="text-gray-700 leading-relaxed">{route.description}</p>
              </section>
            )}

            {/* Inclusions & Exclusions */}
            {(route.inclusions.length > 0 || route.exclusions.length > 0) && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What's included & what's not</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Included</h3>
                    <ul className="space-y-3">
                      {route.inclusions.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Not included</h3>
                    <ul className="space-y-3">
                      {route.exclusions.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right Column — Sticky Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-1">From</p>
                <p className="text-4xl font-bold text-gray-900">{format(route.basePrice)}</p>
                <p className="text-gray-600 text-sm">/ car (Max 3 pax)</p>
              </div>

              <div className="border-t border-gray-200 my-6" />

              {/* Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Time */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Passengers */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white"
                  >
                    {[1,2,3,4,5,6,7,8,9].map(n => (
                      <option key={n} value={n}>
                        {n} Passengers {n > 3 ? ` → Need ${Math.ceil(n/3)} cars` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Preview */}
              {carsNeeded > 1 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4 text-sm">
                  <p className="text-orange-800 font-medium">We will dispatch {carsNeeded} cars for {passengers} passengers</p>
                  <p className="text-orange-700">Total: {format(totalPrice)}</p>
                </div>
              )}

              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 mb-4 text-base"
                onClick={handleBookNow}
                disabled={!date || !time}
              >
                {!date || !time ? 'Please Select Date & Time' : 'Book Now →'}
              </Button>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <span>No hidden costs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span>Secure transactions</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>Free cancellation up to 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
