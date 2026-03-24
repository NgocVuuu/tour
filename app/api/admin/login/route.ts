import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    let isOfflineMode = false;
    try {
      await connectDB();
    } catch (dbError) {
      console.warn('[MongoDB] Connection failed. Using Offline Admin Mode.');
      isOfflineMode = true;
    }

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password required' }, { status: 400 });
    }

    let adminUser = { _id: 'offline-admin-id', username: 'admin', role: 'superadmin' };

    if (isOfflineMode) {
      // Offline Bypass Check
      if (username !== 'admin' || password !== 'admin123') {
        return NextResponse.json({ success: false, error: 'Offline mode active. Use admin/admin123' }, { status: 401 });
      }
    } else {
      // Online Database Check
      const adminCount = await Admin.countDocuments();
      if (adminCount === 0) {
        const defaultHash = await bcrypt.hash('admin123', 10);
        await Admin.create({
          username: 'admin',
          passwordHash: defaultHash,
          role: 'superadmin'
        });
      }

      const foundAdmin = await Admin.findOne({ username });
      if (!foundAdmin) {
        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
      }

      const isMatch = await bcrypt.compare(password, foundAdmin.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
      }
      
      adminUser = { _id: foundAdmin._id.toString(), username: foundAdmin.username, role: foundAdmin.role };
    }

    // Sign JWT Token
    const token = jwt.sign(
      { id: adminUser._id, username: adminUser.username, role: adminUser.role },
      process.env.JWT_SECRET || 'fallback_secret_key_for_offline',
      { expiresIn: '24h' }
    );

    const response = NextResponse.json({ success: true, user: adminUser.username });

    // Store token securely inside an HttpOnly cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[POST /api/admin/login]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  // Logout: delete auth cookie
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_token');
  return response;
}
