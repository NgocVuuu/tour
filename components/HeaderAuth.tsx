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
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
        <Link href="/dashboard" className="w-full sm:w-auto flex-1">
          <Button variant="ghost" className="flex items-center justify-start sm:justify-center gap-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 h-11 sm:h-9 w-full rounded-lg border border-gray-200 sm:border-transparent">
            {session.user.image ? (
              <Image src={session.user.image} alt={session.user.name || 'User'} width={24} height={24} className="rounded-full" />
            ) : (
              <User className="w-4 h-4" />
            )}
            <span className="text-sm font-medium truncate">{session.user.name}</span>
          </Button>
        </Link>
        <button onClick={() => signOut()} className="w-full sm:w-auto flex items-center justify-center gap-2 p-2 sm:p-2 text-red-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition border border-red-200 sm:border-transparent h-11 sm:h-9" title="Logout">
          <LogOut className="w-4 h-4" />
          <span className="sm:hidden font-medium text-sm">Logout</span>
        </button>
      </div>
  }

  return (
    <Link href="/login" className="w-full sm:w-auto inline-block">
      <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold h-11 sm:h-9 px-4 flex w-full justify-center">
        Login
      </Button>
    </Link>
  );
}
