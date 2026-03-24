import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
import Link from 'next/link';
import { Home, Calendar, MapPin, Clock } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  // NextAuth types might not show 'whatsapp' or 'id' without custom augmentation, 
  // but we added them in the session callback.
  const userEmail = session.user.email;
  const userPhone = (session.user as any).whatsapp;

  if (!userEmail && !userPhone) {
    redirect('/login');
  }

  await connectDB();
  
  // Fetch bookings linked to this user's email OR phone
  const query: any = { $or: [] };
  if (userEmail) query.$or.push({ email: userEmail });
  if (userPhone) query.$or.push({ whatsapp: userPhone });

  const bookings = await Booking.find(query).sort({ createdAt: -1 }).lean();

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-orange-500 transition">
            <Home className="w-5 h-5" />
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold text-gray-900">Quản Lý Chuyến Đi</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-4">
            {session.user.image ? (
              <img src={session.user.image} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-orange-100" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-2xl font-bold">
                {session.user.name?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Xin chào, {session.user.name}</h2>
              <p className="text-gray-600">{session.user.email || (session.user as any).whatsapp}</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-6">Lịch Sử Đặt Xe Của Bạn ({bookings.length})</h3>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm">
            <p className="text-gray-500 mb-6">Bạn chưa có chuyến xe nào được hệ thống ghi nhận dưới thông tin này ({session.user.email || (session.user as any).whatsapp}).</p>
            <Link href="/" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-lg transition">
              Đặt Chuyến Xe Đầu Tiên
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking: any) => {
              const dateObj = new Date(booking.transferDate);
              const dateStr = dateObj.toLocaleDateString('vi-VN');
              const timeStr = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
              
              const statusColors: Record<string, string> = {
                'pending': 'bg-yellow-100 text-yellow-800',
                'confirmed': 'bg-blue-100 text-blue-800',
                'completed': 'bg-green-100 text-green-800',
                'cancelled': 'bg-red-100 text-red-800',
              };

              const statusText: Record<string, string> = {
                'pending': 'Chờ Xác Nhận',
                'confirmed': 'Đã Xác Nhận',
                'completed': 'Hoàn Thành',
                'cancelled': 'Đã Hủy',
              };

              return (
                <div key={booking._id.toString()} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500">Mã Số: #{booking.bookingCode}</span>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[booking.status] || 'bg-gray-100 text-gray-800'}`}>
                        {statusText[booking.status] || booking.status}
                      </span>
                    </div>
                    
                    <h4 className="text-lg font-bold text-gray-900 mb-4">{booking.routeName}</h4>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-orange-500 flex-shrink-0" />
                        <div>
                          <p><span className="font-medium text-gray-700">Đón:</span> {booking.pickupAddress}</p>
                          <p className="mt-1"><span className="font-medium text-gray-700">Đến:</span> {booking.dropoffAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="w-4 h-4 text-orange-500" />
                        <span>{dateStr}</span>
                        <Clock className="w-4 h-4 ml-2 text-orange-500" />
                        <span>{timeStr}</span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:w-48 sm:border-l border-t sm:border-t-0 border-gray-200 sm:pl-6 pt-4 sm:pt-0 flex flex-col justify-end">
                    <p className="text-sm text-gray-500 mb-1">Thanh toán (Dự kiến)</p>
                    <p className="text-2xl font-bold text-gray-900 hidden sm:block">
                      {booking.totalPriceDisplay} {booking.currency}
                    </p>
                    <p className="text-lg font-bold text-gray-900 sm:hidden">
                      {booking.totalPriceDisplay} {booking.currency}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">100% Giá Cố Định</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
