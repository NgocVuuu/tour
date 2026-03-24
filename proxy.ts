import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const PROTECTED_PATHS = ['/admin', '/api/admin'];

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Kiểm tra xem có phải protected path không
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Cho phép pass qua trang login và API login
  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  // Lấy token từ cookie
  const token = req.cookies.get('admin_token')?.value;

  if (!token) {
    // Nếu là API call, trả về 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    // Nếu là page, redirect về login
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  // Verify JWT
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch {
    // Token hết hạn hoặc invalid
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 });
    }
    const response = NextResponse.redirect(new URL('/admin/login', req.url));
    response.cookies.delete('admin_token');
    return response;
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
