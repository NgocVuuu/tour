/**
 * Seed Script — Tạo dữ liệu mẫu vào MongoDB
 *
 * Cách dùng:
 *   1. Đảm bảo file .env.local đã có MONGODB_URI
 *   2. Chạy: npm run seed
 */

import { config } from 'dotenv';
// Load .env.local (Next.js dùng .env.local, không phải .env)
config({ path: '.env.local' });

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined. Create .env.local first.');
}

// ─── Models (inline để không phụ thuộc vào path alias) ────────────────────────

const RouteSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  basePrice: { type: Number, required: true },
  duration: String,
  images: [String],
  highlights: [String],
  inclusions: [String],
  exclusions: [String],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const SettingsSchema = new mongoose.Schema({
  exchangeRates: {
    USD: { type: Number, default: 1 },
    EUR: { type: Number, default: 0.92 },
    AUD: { type: Number, default: 1.58 },
  },
  payoneerAccount: String,
  bankTransferDetails: String,
  whatsappNumber: String,
  telegramBotToken: String,
  telegramChatId: String,
}, { timestamps: true });

const BlogPostSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  metaTitle: String,
  metaDescription: String,
  heroImage: { type: String, required: true },
  author: { type: String, default: 'Admin' },
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
}, { timestamps: true });

const Route = mongoose.models.Route || mongoose.model('Route', RouteSchema);
const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

// ─── Seed Data ─────────────────────────────────────────────────────────────────

const routes = [
  {
    slug: 'danang-airport-to-hoi-an',
    name: 'Da Nang Airport to Hoi An',
    description: 'Comfortable private transfer from Da Nang International Airport to Hoi An Ancient Town.',
    basePrice: 25,
    duration: '45 mins',
    images: [
      'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    ],
    highlights: [
      'Door-to-door private service',
      'English-speaking driver',
      'Air-conditioned vehicle',
      'Max 3 passengers per car',
      'Free cancellation 24h before',
    ],
    inclusions: ['Air-conditioned vehicle', 'Professional driver', 'Toll fees', 'Luggage assistance'],
    exclusions: ['Meals & beverages', 'Gratuities', 'Travel insurance'],
    isActive: true,
  },
  {
    slug: 'danang-to-ba-na-hills',
    name: 'Da Nang City to Ba Na Hills',
    description: 'Private transfer from Da Nang city center to the famous Ba Na Hills resort.',
    basePrice: 35,
    duration: '1 hour',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    ],
    highlights: [
      'Flexible pickup location in Da Nang',
      'English-speaking driver',
      'Return trips available',
      'Max 3 passengers per car',
    ],
    inclusions: ['Air-conditioned vehicle', 'Professional driver', 'Toll fees'],
    exclusions: ['Ba Na Hills cable car ticket', 'Return trip (book separately)', 'Meals'],
    isActive: true,
  },
  {
    slug: 'hoi-an-to-danang-airport',
    name: 'Hoi An to Da Nang Airport',
    description: 'Reliable private transfer from Hoi An to Da Nang International Airport.',
    basePrice: 25,
    duration: '45 mins',
    images: [
      'https://images.unsplash.com/photo-1504681869696-d977211867ff?w=600&h=400&fit=crop',
    ],
    highlights: [
      'Hotel pickup in Hoi An',
      'English-speaking driver',
      'Flight monitoring available',
      'Max 3 passengers per car',
    ],
    inclusions: ['Air-conditioned vehicle', 'Professional driver', 'Toll fees', 'Luggage assistance'],
    exclusions: ['Meals & beverages', 'Gratuities'],
    isActive: true,
  },
];

const defaultSettings = {
  exchangeRates: { USD: 1, EUR: 0.92, AUD: 1.58 },
  payoneerAccount: 'contact@danangprivatetransfer.com',
  bankTransferDetails: 'Please contact us on WhatsApp for bank transfer details.',
  whatsappNumber: '84905555555',
  telegramBotToken: '',
  telegramChatId: '',
};

const blogPosts = [
  {
    slug: 'danang-airport-hoi-an',
    title: 'The Ultimate Guide: Da Nang Airport to Hoi An in 2026', 
    excerpt: 'Everything you need to know about getting from Da Nang Airport to Hoi An Ancient Town.', 
    heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop', 
    author: 'Admin', 
    isPublished: true,
    publishedAt: new Date('2026-03-01'),
    content: '<p>Traveling from Da Nang Airport to Hoi An is a journey of about 30km and typically takes 45 minutes.</p><p>The most convenient way is booking a private transfer. It offers door-to-door service and english speaking drivers.</p>'
  },
  {
    slug: 'ba-na-hills',
    title: 'Ba Na Hills Guide: Cable Car & French Village 2026', 
    excerpt: 'Plan the perfect day trip to Ba Na Hills from Da Nang with our comprehensive guide.', 
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop', 
    author: 'Admin',
    isPublished: true,
    publishedAt: new Date('2026-02-15'),
    content: '<p>Ba Na Hills is one of the most famous tourist attractions in Da Nang, featuring the iconic Golden Bridge.</p><p>Getting there early can help you avoid the crowds. A private car will get you to the cable car station comfortably.</p>'
  },
  {
    slug: 'hoi-an-guide',
    title: 'Exploring Hoi An: History, Food & Lanterns', 
    excerpt: 'Discover the magic of Hoi An Ancient Town — from lantern-lit streets to world-class cuisine.', 
    heroImage: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=400&h=250&fit=crop', 
    author: 'Admin',
    isPublished: true,
    publishedAt: new Date('2026-02-01'),
    content: '<p>Hoi An is designated as a UNESCO World Heritage site, famous for its exceptionally well-preserved Ancient Town.</p><p>Don\'t miss the local delicacies like Cao Lau and Banh Mi, and enjoy walking under the colorful lanterns at night.</p>'
  }
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected!\n');

  // Seed Routes
  console.log('📍 Seeding Routes...');
  for (const route of routes) {
    await Route.findOneAndUpdate({ slug: route.slug }, route, { upsert: true, new: true });
    console.log(`  ✓ ${route.name} ($${route.basePrice})`);
  }

  // Seed Settings
  console.log('\n⚙️  Seeding Settings...');
  await Settings.findOneAndUpdate({}, defaultSettings, { upsert: true });
  console.log('  ✓ Exchange rates: USD=1, EUR=0.92, AUD=1.58');
  console.log('  ✓ Default settings created');

  // Seed Blog Posts
  console.log('\n📝 Seeding Blog Posts...');
  for (const post of blogPosts) {
    await BlogPost.findOneAndUpdate({ slug: post.slug }, post, { upsert: true, new: true });
    console.log(`  ✓ Blog: ${post.title}`);
  }

  console.log('\n🎉 Seed complete!\n');
  console.log('Next steps:');
  console.log('  1. Update .env.local with your real Telegram & Resend credentials');
  console.log('  2. Run: npm run dev');
  console.log('  3. Visit: http://localhost:3000\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
