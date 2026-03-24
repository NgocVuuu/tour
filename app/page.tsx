'use client';

import { MapPin, Clock, Users, Calendar, MessageCircle, ChevronRight, CheckCircle, DollarSign, Lock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from 'react';
import { useCurrency, Currency } from '@/lib/context/CurrencyContext';
import { HeaderAuth } from '@/components/HeaderAuth';

interface Route {
  _id: string;
  slug: string;
  name: string;
  basePrice: number;
  duration: string;
  images: string[];
}

interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  heroImage: string;
  publishedAt: string;
}

export default function Home() {
  const { currency, setCurrency, format } = useCurrency();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [dateTime, setDateTime] = useState('');

  // Fetch routes + blog posts khi page load
  useEffect(() => {
    fetch('/api/routes')
      .then((r) => r.json())
      .then((d) => { if (d.success) setRoutes(d.data); })
      .catch(() => {});

    fetch('/api/blog?limit=3')
      .then((r) => r.json())
      .then((d) => { if (d.success) setBlogPosts(d.data); })
      .catch(() => {});
  }, []);

  // Fallback routes khi chưa có data hoặc API lỗi
  const displayRoutes = routes.length > 0 ? routes : [
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            DaNang Private Transfer
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link href="/routes" className="hover:text-orange-500 transition">Bảng Giá</Link>
              <Link href="/blog" className="hover:text-orange-500 transition">Cẩm Nang</Link>
            </nav>
            <Select value={currency} onValueChange={(val) => setCurrency(val as Currency)}>
              <SelectTrigger className="w-[95px] px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200">
                <SelectValue placeholder="Tiền tệ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VND">VND (₫)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="AUD">AUD (A$)</SelectItem>
              </SelectContent>
            </Select>
            <HeaderAuth />
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '84905555555'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <button className="p-2 bg-gray-50 border border-transparent hover:border-orange-200 hover:bg-orange-50 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-sm">
                <MessageCircle className="w-5 h-5 text-gray-700 group-hover:text-orange-500 transition-colors" />
              </button>
            </a>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '84905555555'}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-orange-500 hover:bg-orange-600 text-white hover:scale-105 hover:shadow-lg transition-all duration-200 font-semibold">
                Contact
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 sm:h-[500px] lg:h-[600px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop"
          alt="Da Nang Golden Bridge"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-4 text-balance">
            Xe Ghép & Thuê Xe Đà Nẵng
          </h1>
          <p className="text-lg sm:text-xl text-center max-w-2xl text-gray-100">
            Tận hưởng chuyến đi trọn vẹn, tài xế thân thiện, xe 100% riêng tư
          </p>
        </div>

      </section>

      {/* Floating Booking Widget */}
      <div className="relative z-10 -mt-24 w-full max-w-5xl mx-auto px-4 mb-16">
        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Điểm Đón</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500">
                <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="VD: Sân bay Đà Nẵng"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="flex-1 outline-none text-sm"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Điểm Đến</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500">
                <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="VD: Hội An"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  className="flex-1 outline-none text-sm"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày & Giờ</label>
              <div 
                className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500 bg-white hover:border-orange-400 transition-colors cursor-pointer"
                onClick={(e) => {
                  const input = e.currentTarget.querySelector('input');
                  if (input) {
                    try { if ('showPicker' in input) input.showPicker(); } catch (err) {}
                  }
                }}
              >
                <Calendar className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                <input 
                  type="datetime-local" 
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="flex-1 outline-none text-sm bg-transparent cursor-pointer" 
                  onClick={(e) => {
                    try { if ('showPicker' in e.currentTarget) e.currentTarget.showPicker(); } catch (err) {}
                  }}
                />
              </div>
            </div>

            <div className="relative flex flex-col justify-end">
              <label className="block text-sm font-medium text-gray-700 mb-2">Số Khách</label>
              <Select value={passengers} onValueChange={setPassengers}>
                <SelectTrigger className="w-full h-[38px] border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-orange-500 bg-white hover:border-orange-400 transition-colors">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <SelectValue placeholder="Số Khách" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8,9].map(n => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} Lượt Khách {n>3?`(${Math.ceil(n/3)} xe)`:''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col justify-end">
              <Link href={`/routes/danang-airport-to-hoi-an?pickup=${encodeURIComponent(pickup)}&dropoff=${encodeURIComponent(dropoff)}&date=${encodeURIComponent(dateTime)}&pax=${passengers}`}>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 h-auto">
                  Tìm Chuyến & Đặt Xe
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <section className="bg-slate-50 py-16 sm:py-20 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hủy Chuyến Miễn Phí</h3>
              <p className="text-gray-600 text-sm">Bạn có thể hủy xe trước 24 tiếng và được hoàn tiền 100% không giới hạn.</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <DollarSign className="w-12 h-12 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Giá Cố Định & Minh Bạch</h3>
              <p className="text-gray-600 text-sm">Thanh toán qua chuyển khoản ngân hàng hoặc tiền mặt. Không có bất kỳ phụ phí ẩn nào.</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Lock className="w-12 h-12 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trải Nghiệm Riêng Tư 100%</h3>
              <p className="text-gray-600 text-sm">Chỉ duy nhất nhóm của bạn trên xe. Tránh xa sự ồn ào và mệt mỏi của xe khách.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes — Data từ API */}
      <section id="routes" className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 text-center">
            Các Tuyến Khách Đi Nhiều Nhất
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayRoutes.map((route) => (
              <Link key={route._id} href={`/routes/${route.slug}`}>
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition border border-gray-200 cursor-pointer h-full">
                  <div className="relative h-48 w-full">
                    <Image
                      src={route.images[0] || 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=400&h=300&fit=crop'}
                      alt={route.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{route.name}</h3>
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
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
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
        </div>
      </section>

      {/* Blog Teaser */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 text-center">
            Cẩm Nang Du Lịch Đà Nẵng
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {blogPosts.length > 0
              ? blogPosts.map((post) => (
                  <Link key={post._id} href={`/blog/${post.slug}`}>
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer">
                      <div className="relative h-40 w-full">
                        <Image
                          src={post.heroImage || 'https://images.unsplash.com/photo-1488390671519-ce21cc028cb4?w=400&h=250&fit=crop'}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-gray-500 mb-2">
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
                        </p>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{post.title}</h3>
                        <span className="inline-flex items-center text-orange-500 font-medium hover:text-orange-600">
                          Xem chi tiết <ChevronRight className="w-4 h-4 ml-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              : /* Fallback — hiển thị khi chưa có blog post nào được publish */
                [
                  { title: 'The Ultimate Guide: Da Nang Airport to Hoi An in 2026', img: 'https://images.unsplash.com/photo-1488390671519-ce21cc028cb4?w=400&h=250&fit=crop', date: 'March 2026', slug: 'danang-airport-hoi-an' },
                  { title: 'Ba Na Hills Guide: Cable Car & French Village 2026', img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=250&fit=crop', date: 'February 2026', slug: 'ba-na-hills' },
                  { title: 'Exploring Hoi An: History, Food & Lanterns', img: 'https://images.unsplash.com/photo-1542401886-65d27afda266?w=400&h=250&fit=crop', date: 'January 2026', slug: 'hoi-an-guide' },
                ].map((b, i) => (
                  <Link key={i} href={`/blog/${b.slug}`}>
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer">
                      <div className="relative h-40 w-full">
                        <Image src={b.img} alt={b.title} fill className="object-cover" />
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-gray-500 mb-2">{b.date}</p>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{b.title}</h3>
                        <span className="inline-flex items-center text-orange-500 font-medium">
                          Xem chi tiết <ChevronRight className="w-4 h-4 ml-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/blog">
              <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
                Xem Tất Cả Bài Viết
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Công Ty</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Về Chúng Tôi</a></li>
                <li><Link href="/blog" className="hover:text-white transition">Cẩm Nang</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Hỗ Trợ</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Câu Hỏi Thường Gặp</a></li>
                <li><a href="#" className="hover:text-white transition">Chính Sách Hủy Phiếu</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Pháp Lý</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Bảo Mật Thông Tin</a></li>
                <li><a href="#" className="hover:text-white transition">Điều Khoản Dịch Vụ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Thanh Toán</h4>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-gray-800 rounded text-xs">Visa</span>
                <span className="px-2 py-1 bg-gray-800 rounded text-xs">Mastercard</span>
                <span className="px-2 py-1 bg-gray-800 rounded text-xs">Payoneer</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm">© 2026 DaNang Private Transfer. All rights reserved.</p>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '84905555555'}`}
                className="hover:text-white transition flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
