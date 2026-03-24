'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import Image from 'next/image';

export function HeaderAuth() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="w-24 h-9 animate-pulse bg-gray-200 rounded-md"></div>;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/dashboard">
          <Button variant="ghost" className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-2 h-9">
            {session.user.image ? (
              <Image src={session.user.image} alt={session.user.name || 'User'} width={24} height={24} className="rounded-full" />
            ) : (
              <User className="w-4 h-4" />
            )}
            <span className="text-sm font-medium max-w-[100px] truncate">{session.user.name}</span>
          </Button>
        </Link>
        <button onClick={() => signOut()} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition" title="Đăng Xuất">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <Link href="/login">
      <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50 font-medium h-9 px-4 hidden sm:flex">
        Đăng Nhập
      </Button>
    </Link>
  );
}
