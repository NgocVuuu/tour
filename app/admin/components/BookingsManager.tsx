'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, Eye, FileText, Loader2, Trash2, X, Edit3, Mail, Phone, MapPin, DollarSign, Users } from 'lucide-react';
import { BookingStatus, PaymentMethod } from '@/lib/models/Booking';

export interface ClientBooking {
  _id: string;
  bookingCode: string;
  routeId: string;
  routeName: string;
  routeSlug: string;
  customerName: string;
  email: string;
  whatsapp: string;
  pickupAddress: string;
  dropoffAddress: string;
  flightNumber?: string;
  notes?: string;
  pax: number;
  carsRequired: number;
  basePrice: number;
  totalPriceUSD: number;
  totalPriceDisplay: number;
  currency: string;
  exchangeRate: number;
  paymentMethod: PaymentMethod;
  status: BookingStatus;
  transferDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function BookingsManager() {
  const [bookings, setBookings] = useState<ClientBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  
  // Viewing/Editing Modal State
  const [viewing, setViewing] = useState<ClientBooking | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/bookings');
    const data = await res.json();
    if (data.success) {
      setBookings(data.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    setDeleting(id);
    await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
    fetchBookings();
    setDeleting(null);
  }

  async function handleStatusChange(bookingId: string, newStatus: BookingStatus) {
    setSavingStatus(true);
    await fetch(`/api/admin/bookings/${bookingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    setSavingStatus(false);
    
    // Update local state and modal view
    setBookings((prev) => prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
    if (viewing && viewing._id === bookingId) {
      setViewing({ ...viewing, status: newStatus });
    }
  }

  function getStatusColor(status: BookingStatus) {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bookings Management</h2>
          <p className="text-sm text-gray-500 mt-1">{bookings.length} total bookings</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          <Calendar className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No bookings yet</p>
          <p className="text-sm mt-1">When customers book transfers, they will appear here.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-6 py-4">Booking Code</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Transfer Date</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Price / Cars</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id as string} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-semibold text-orange-600">{b.bookingCode}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{b.customerName}</div>
                    <div className="text-xs text-gray-500">{b.whatsapp}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(b.transferDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.routeName}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{b.totalPriceDisplay} {b.currency}</div>
                    <div className="text-xs text-gray-500">{b.carsRequired} car(s) - {b.pax} pax</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${getStatusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3">
                    <button onClick={() => setViewing(b)} className="p-2 hover:bg-blue-50 text-blue-500 hover:text-blue-700 rounded-lg transition" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(b._id as string)} disabled={deleting === b._id} className="p-2 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition disabled:opacity-50" title="Delete Booking">
                      {deleting === b._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Booking Details Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
              <h3 className="text-lg font-bold text-gray-900">Booking {viewing.bookingCode}</h3>
              <button onClick={() => setViewing(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Customer Info */}
              <div>
                <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-4 border-b pb-2">
                  <Users className="w-4 h-4 text-orange-500" /> Customer Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500 block">Name</span><span className="font-medium text-gray-900">{viewing.customerName}</span></div>
                  <div><span className="text-gray-500 block flex items-center gap-1"><Phone className="w-3 h-3"/> WhatsApp</span><span className="font-medium text-gray-900">{viewing.whatsapp}</span></div>
                  <div><span className="text-gray-500 block flex items-center gap-1"><Mail className="w-3 h-3"/> Email</span><span className="font-medium text-gray-900">{viewing.email}</span></div>
                </div>
              </div>

              {/* Transfer Details */}
              <div>
                <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-4 border-b pb-2">
                  <MapPin className="w-4 h-4 text-orange-500" /> Transfer Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                  <div className="sm:col-span-2"><span className="text-gray-500 block">Route</span><span className="font-bold text-gray-900 text-base">{viewing.routeName}</span></div>
                  <div className="sm:col-span-2"><span className="text-gray-500 block">Date & Time</span><span className="font-medium text-gray-900">{new Date(viewing.transferDate).toLocaleString()}</span></div>
                  <div><span className="text-gray-500 block">Pickup Location</span><span className="font-medium text-gray-900">{viewing.pickupAddress}</span></div>
                  <div><span className="text-gray-500 block">Dropoff Location</span><span className="font-medium text-gray-900">{viewing.dropoffAddress}</span></div>
                  {viewing.flightNumber && (
                    <div className="sm:col-span-2"><span className="text-gray-500 block">Flight Number</span><span className="font-medium text-gray-900">{viewing.flightNumber}</span></div>
                  )}
                  {viewing.notes && (
                    <div className="sm:col-span-2"><span className="text-gray-500 block">Special Notes</span><span className="font-medium text-gray-900 whitespace-pre-wrap">{viewing.notes}</span></div>
                  )}
                </div>
              </div>

              {/* Payment & Status */}
              <div>
                <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-4 border-b pb-2">
                  <DollarSign className="w-4 h-4 text-orange-500" /> Pricing & Status
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm items-center">
                  <div>
                    <span className="text-gray-500 block">Total Price</span>
                    <span className="font-bold text-gray-900 text-lg">{viewing.totalPriceDisplay} {viewing.currency}</span>
                    <span className="text-xs text-gray-400 ml-2">({viewing.totalPriceUSD} USD)</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Payment Method</span>
                    <span className="font-medium text-gray-900 capitalize">{viewing.paymentMethod}</span>
                  </div>
                  <div className="sm:col-span-2 mt-4 p-4 border border-orange-100 bg-orange-50 rounded-lg">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Update Booking Status</label>
                    <div className="flex items-center gap-4">
                      <select 
                        disabled={savingStatus}
                        value={viewing.status}
                        onChange={(e) => handleStatusChange(viewing._id as string, e.target.value as BookingStatus)}
                        className="flex-1 px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white shadow-sm font-medium disabled:opacity-50"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {savingStatus && <Loader2 className="w-5 h-5 animate-spin text-orange-500" />}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
