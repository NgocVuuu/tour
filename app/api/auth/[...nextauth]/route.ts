import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodbClient';
import { adminAuth } from '@/lib/firebase-admin';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models/User';

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    // Zalo Custom Provider
    {
      id: "zalo",
      name: "Zalo",
      type: "oauth",
      authorization: {
        url: "https://oauth.zaloapp.com/v4/permission",
        params: { scope: "profile,email" },
      },
      token: "https://oauth.zaloapp.com/v4/access_token",
      userinfo: "https://graph.zalo.me/v2.0/me?fields=id,name,picture",
      clientId: process.env.ZALO_APP_ID,
      clientSecret: process.env.ZALO_APP_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email || null,
          image: profile.picture?.data?.url || null,
        }
      },
    },
    // Firebase Phone Auth
    CredentialsProvider({
      id: "phone",
      name: "Phone",
      credentials: {
        idToken: { label: "ID Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.idToken) return null;
        try {
          // Decode the Firebase JWT
          const decodedToken = await adminAuth.verifyIdToken(credentials.idToken);
          const phoneNumber = decodedToken.phone_number;
          if (!phoneNumber) return null;

          await connectDB();
          let user = await User.findOne({ whatsapp: phoneNumber });
          if (!user) {
            // First time login
            user = await User.create({
              name: `Khách ${phoneNumber.slice(-4)}`,
              whatsapp: phoneNumber,
              role: 'customer'
            });
          }
          return { id: user._id.toString(), name: user.name, whatsapp: user.whatsapp, role: user.role };
        } catch (error) {
          console.error("Firebase token verification error:", error);
          return null;
        }
      }
    }) as any,
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'customer';
        token.whatsapp = (user as any).whatsapp || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).whatsapp = token.whatsapp;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
