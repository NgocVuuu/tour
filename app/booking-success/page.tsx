'use client';

import { CheckCircle, MessageCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const bookingCode = searchParams.get('code') || '#DN-XXXX';
  const total = searchParams.get('total');
  const currency = searchParams.get('currency') || 'USD';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '84905555555';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <CheckCircle className="w-24 h-24 text-green-500" strokeWidth={1.5} />
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-10" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-900 mb-3">
          Booking Successful!
        </h1>
        <p className="text-center text-lg text-gray-600 mb-3">
          Your booking reference code is{' '}
          <span className="font-semibold text-orange-500 text-xl">{bookingCode}</span>
        </p>
        {total && Number(total) > 0 ? (
          <p className="text-center text-gray-600 mb-8">
            Total fee: <span className="font-bold text-gray-900">{total} {currency}</span>
          </p>
        ) : (
          <p className="text-center text-orange-600 font-medium mb-8">
            Waiting for our operator to contact you with a quote for this custom route.
          </p>
        )}

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">What happens next?</h2>
          <ul className="space-y-4">
            {[
              'Our operator will review your route and confirm your car within 30 minutes.',
              'An email with route confirmation and driver details will be sent to you.',
              'Before departure, the driver will call you or pick you up at the meeting point with a name board.',
            ].map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                  {i + 1}
                </span>
                <span className="text-gray-700 pt-0.5">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* WhatsApp CTA */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=Hello!%20My%20booking%20code%20is%20${bookingCode}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition duration-200 shadow-sm hover:shadow-md mb-4 block"
        >
          <MessageCircle className="w-5 h-5" />
          Click to Confirm via WhatsApp/Zalo (24/7)
        </a>
        <p className="text-center text-sm text-gray-500 mb-6">Our operations team is available 24/7 to assist you</p>

        <Link href="/" className="block">
          <Button variant="outline" className="w-full py-3 text-gray-700 border-gray-300 hover:bg-gray-50">
            <Home className="w-4 h-4 mr-2" />
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" /></div>}>
      <BookingSuccessContent />
    </Suspense>
  );
}
