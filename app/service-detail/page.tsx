'use client';

import { MapPin, Clock, Users, Calendar, Star, Check, X, ChevronRight, Home, Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState } from 'react';

export default function ServiceDetail() {
  const [passengers, setPassengers] = useState('1');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">
            DaNang Private Transfer
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Contact Us
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Content (65-70%) */}
          <div className="lg:col-span-2">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
              <a href="/" className="hover:text-orange-500 flex items-center gap-1">
                <Home className="w-4 h-4" />
                Home
              </a>
              <ChevronRight className="w-4 h-4" />
              <a href="#" className="hover:text-orange-500">Da Nang</a>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Transfers</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Private Transfer: Da Nang Airport to Hoi An
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
                ))}
              </div>
              <span className="font-semibold text-gray-900">4.9</span>
              <span className="text-gray-600">(120 reviews)</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-600">Booked 500+ times</span>
            </div>

            {/* Image Gallery */}
            <div className="mb-8">
              <div className="grid grid-cols-3 gap-4 h-96">
                {/* Main Image - Left */}
                <div className="col-span-2 relative rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=600&h=400&fit=crop"
                    alt="Da Nang Airport to Hoi An transfer"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Smaller Images - Right */}
                <div className="flex flex-col gap-4">
                  <div className="relative rounded-lg overflow-hidden flex-1">
                    <Image
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop"
                      alt="Scenic route view"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative rounded-lg overflow-hidden flex-1">
                    <Image
                      src="https://images.unsplash.com/photo-1504681869696-d977211867ff?w=300&h=200&fit=crop"
                      alt="Hotel drop-off"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* About This Activity - Highlights */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About this activity</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Highlight 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Check className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Free cancellation</h3>
                    <p className="text-gray-600 text-sm">Cancel up to 24 hours in advance.</p>
                  </div>
                </div>

                {/* Highlight 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Check className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Reserve now & pay later</h3>
                    <p className="text-gray-600 text-sm">Flexible booking options available.</p>
                  </div>
                </div>

                {/* Highlight 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Clock className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Duration: 45 minutes</h3>
                    <p className="text-gray-600 text-sm">Direct route to your destination.</p>
                  </div>
                </div>

                {/* Highlight 4 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Users className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">English-speaking driver</h3>
                    <p className="text-gray-600 text-sm">Professional & courteous service.</p>
                  </div>
                </div>

                {/* Highlight 5 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Shield className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Private group</h3>
                    <p className="text-gray-600 text-sm">Max 3 passengers per car.</p>
                  </div>
                </div>

                {/* Highlight 6 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Lock className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Secure booking</h3>
                    <p className="text-gray-600 text-sm">Protected transactions & privacy.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Full Description */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience the convenience</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Enjoy a seamless airport transfer experience. Our professional driver will greet you at the Da Nang International Airport arrival gate with a personalized nameplate. You'll be escorted to your comfortable, air-conditioned private vehicle where you can relax and take in the scenic Vietnamese landscape.
                </p>
                <p>
                  During the 45-minute journey to Hoi An, you'll pass through lush countryside and coastal views, with opportunities to enjoy the natural beauty of Central Vietnam. Your driver is knowledgeable about the region and available to share local insights and travel tips.
                </p>
                <p>
                  Upon arrival at your hotel, our driver will assist with your luggage and ensure you're comfortably settled before departure. This private transfer eliminates the hassle of finding transportation, negotiating with taxi drivers, or dealing with crowded shuttle services—giving you more time to focus on enjoying your vacation.
                </p>
              </div>
            </section>

            {/* Inclusions & Exclusions */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's included & what's not</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Inclusions */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Included</h3>
                  <ul className="space-y-3">
                    {['Air-conditioned vehicle', 'Professional driver', 'Toll fees', 'Luggage assistance', 'Hotel pickup/dropoff'].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Not included</h3>
                  <ul className="space-y-3">
                    {['Meals & beverages', 'Gratuities', 'Travel insurance', 'Personal expenses'].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Sticky Booking Widget (30-35%) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              {/* Price */}
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-1">From</p>
                <p className="text-4xl font-bold text-gray-900">$25</p>
                <p className="text-gray-600 text-sm">per car</p>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6" />

              {/* Date Picker */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Time Picker */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Passengers Dropdown */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Passengers
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="1">1 Passenger</option>
                    <option value="2">2 Passengers</option>
                    <option value="3">3 Passengers</option>
                  </select>
                </div>
              </div>

              {/* Check Availability Button */}
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 mb-4 text-base">
                Check Availability
              </Button>

              {/* Security Footer */}
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <span>No hidden costs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span>Secure payment via Payoneer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Payment Methods</h4>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-gray-800 rounded text-xs">Payoneer</span>
                <span className="px-2 py-1 bg-gray-800 rounded text-xs">Credit Card</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-sm">&copy; 2026 DaNang Private Transfer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
