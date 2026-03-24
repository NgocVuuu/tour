'use client';

import Link from 'next/link';
import { Menu, X, MessageCircle, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useCurrency, Currency } from '@/lib/context/CurrencyContext';
import { HeaderAuth } from '@/components/HeaderAuth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const { currency, setCurrency } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide the Navbar entirely on specific flow-oriented pages like Checkout, Login, Admin, Dashboard
  const hidePaths = ['/checkout', '/login', '/admin', '/booking-success', '/dashboard'];
  if (hidePaths.some(path => pathname?.startsWith(path))) {
    return null;
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '84905555555';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900 z-50">
            DaNang Private Transfer
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link href="/routes" className="hover:text-orange-500 transition-colors">Routes</Link>
              <Link href="/blog" className="hover:text-orange-500 transition-colors">Blog</Link>
            </nav>
            
            <Select value={currency} onValueChange={(val) => setCurrency(val as Currency)}>
              <SelectTrigger className="w-[95px] px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200">
                <SelectValue placeholder="Currency" />
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
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-md"
            >
              <MessageCircle className="w-5 h-5" />
              Contact
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl flex flex-col animate-in slide-in-from-top-2">
          
          <div className="px-4 py-2 flex flex-col gap-1">
            <Link 
              href="/routes" 
              className="flex items-center justify-between text-base font-medium text-gray-700 hover:text-orange-600 w-full p-4 rounded-xl hover:bg-orange-50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Routes</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
            
            <Link 
              href="/blog" 
              className="flex items-center justify-between text-base font-medium text-gray-700 hover:text-orange-600 w-full p-4 rounded-xl hover:bg-orange-50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Blog</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>

          <div className="h-2 w-full bg-gray-50 border-y border-gray-100"></div>

          <div className="px-4 py-6 flex flex-col gap-5">
            <div className="flex items-center justify-between px-2">
              <span className="text-base text-gray-700 font-medium">Currency</span>
              <Select value={currency} onValueChange={(val) => setCurrency(val as Currency)}>
                <SelectTrigger className="w-[130px] bg-white border-gray-300 h-10 rounded-lg">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VND">VND (₫)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="AUD">AUD (A$)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full flex flex-col gap-3" onClick={() => setMobileMenuOpen(false)}>
              <HeaderAuth />
              
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2"
              >
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-6 flex items-center justify-center gap-2 text-lg rounded-xl shadow-sm">
                  <MessageCircle className="w-5 h-5" />
                  24/7 Support
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
