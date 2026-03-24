'use client';

import { Lock, MapPin, Plane, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCurrency, Currency } from '@/lib/context/CurrencyContext';
import { useSession } from 'next-auth/react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { format, currency } = useCurrency();

  // Đọc params từ URL (được truyền từ /routes/[slug])
  const routeId = searchParams.get('routeId') || '';
  const routeName = searchParams.get('routeName') || 'Da Nang Airport to Hoi An';
  const paxParam = parseInt(searchParams.get('pax') || '1');
  const dateParam = searchParams.get('date') || '';
  const timeParam = searchParams.get('time') || '';
  const currencyParam = (searchParams.get('currency') as Currency) || currency;

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [pickup, setPickup] = useState(sessionStorage.getItem('pickup') || '');
  const [dropoff, setDropoff] = useState(sessionStorage.getItem('dropoff') || '');
  const [flightNumber, setFlightNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'payoneer' | 'cash'>('payoneer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill from session if logged in
  useEffect(() => {
    if (session?.user) {
      if (session.user.name) {
        const parts = session.user.name.split(' ');
        if (parts.length > 1) {
          setFirstName(parts.slice(0, -1).join(' '));
          setLastName(parts[parts.length - 1]);
        } else {
          setFirstName(session.user.name);
        }
      }
      if (session.user.email) setEmail(session.user.email);
      if ((session.user as any).whatsapp) setWhatsapp((session.user as any).whatsapp);
    }
  }, [session]);

  // Tính toán giá (sẽ được BE recalculate lại, đây chỉ để display)
  const carsRequired = Math.ceil(paxParam / 3);
  const transferDateTime = dateParam && timeParam ? `${dateParam}T${timeParam}:00` : '';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!routeId) {
      setError('Missing route information. Please go back and select a route.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          routeId,
          customerName: `${firstName} ${lastName}`.trim(),
          email,
          whatsapp,
          pickupAddress: pickup,
          dropoffAddress: dropoff,
          flightNumber: flightNumber || undefined,
          notes: notes || undefined,
          pax: paxParam,
          transferDate: transferDateTime,
          currency: currencyParam,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      // Thành công — redirect sang Thank You page
      router.push(`/booking-success?code=${data.data.bookingCode}&total=${data.data.totalPriceDisplay}&currency=${data.data.currency}`);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
          <p className="text-sm text-gray-600 mt-1">Complete your private transfer booking in Central Vietnam</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left — Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Details */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone / WhatsApp / Zalo *</label>
                  <input type="tel" required value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+84 905 123 456"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>

              {/* Transfer Details */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Transfer Details</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" /> Pickup Address (or Hotel Name) *
                  </label>
                  <input type="text" required value={pickup} onChange={(e) => setPickup(e.target.value)}
                    placeholder="Ex: Da Nang International Airport (DAD)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" /> Dropoff Address (or Hotel Name) *
                  </label>
                  <input type="text" required value={dropoff} onChange={(e) => setDropoff(e.target.value)}
                    placeholder="Ex: Hoi An Ancient Town"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Plane className="w-4 h-4 text-orange-500" /> Flight Number
                    <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                  </label>
                  <input type="text" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)}
                    placeholder="Ex: VN123"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests / Notes</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                    placeholder="Example: Need a baby seat, please drive carefully..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
                </div>
              </div>
            </div>

            {/* Right — Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-white rounded-lg p-6 border border-gray-200 shadow-md">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Route</p>
                    <p className="font-medium text-gray-900">{routeName}</p>
                  </div>
                  {dateParam && timeParam && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Date & Time</p>
                      <p className="font-medium text-gray-900">{dateParam} — {timeParam}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Passengers</p>
                    <p className="font-medium text-gray-900">{paxParam} Passengers</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Vehicles</p>
                    <p className="font-medium text-gray-900">
                      <Users className="w-4 h-4 inline mr-1" />
                      {carsRequired} Premium Private Car(s) (Max 3 pax/car)
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 py-4 mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Total Amount</p>
                  <p className={`text-2xl font-bold ${routeId === 'custom' ? 'text-orange-500' : 'text-gray-900'}`}>
                    {routeId === 'custom' ? 'Quote Request' : (routeId ? 'Calculated after confirmation' : '—')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {routeId === 'custom' ? 'Customer Support will contact you with the best price' : 'The system will confirm the final price after booking'}
                  </p>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    {(['payoneer', 'cash'] as const).map((method) => (
                      <div
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-4 border rounded-md cursor-pointer transition ${paymentMethod === method ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:bg-gray-50'}`}
                      >
                        <div className="flex items-start gap-3">
                          <input type="radio" name="payment" value={method} checked={paymentMethod === method}
                            onChange={() => setPaymentMethod(method)} className="mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {method === 'payoneer' ? '💳 Bank Transfer / Payoneer' : '💵 Cash to Driver'}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {method === 'payoneer' ? 'Customer support will send payment info via WhatsApp/Zalo' : 'Pay flexibly in Cash (VND or USD) after the trip'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-md mb-4 text-base disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Processing...
                    </span>
                  ) : 'Confirm Booking →'}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <span>Secure system. Your data is safely encrypted.</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
