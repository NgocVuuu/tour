import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Route from '@/lib/models/Route';

const fallbackRoutes: Record<string, any> = {
  'danang-airport-to-hoi-an': {
    _id: '1', slug: 'danang-airport-to-hoi-an', name: 'Da Nang Airport to Hoi An', basePrice: 25, duration: '45 mins',
    description: 'Travel from Da Nang Airport to the historic town of Hoi An in comfort with our private transfer service. Enjoy a smooth ride in an air-conditioned vehicle with a professional driver.',
    images: [
      'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=800&q=80',
      'https://images.unsplash.com/photo-1542401886-65d27afda266?w=800&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'
    ],
    highlights: ['Door-to-door service', 'Professional English-speaking driver', 'Air-conditioned modern vehicle', 'No hidden fees'],
    inclusions: ['Private vehicle', 'Bottled water', 'Tolls and parking fees', 'Free cancellation up to 24h in advance'],
    exclusions: ['Gratuities (optional)', 'Additional unplanned stops']
  },
  'danang-to-ba-na-hills': {
    _id: '2', slug: 'danang-to-ba-na-hills', name: 'Da Nang to Ba Na Hills', basePrice: 35, duration: '1 hour',
    description: 'Book a comfortable private ride to Ba Na Hills to experience the famous Golden Bridge. Skip the hassle of finding a taxi and travel directly from your hotel.',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
      'https://images.unsplash.com/photo-1488390671519-ce21cc028cb4?w=800&q=80'
    ],
    highlights: ['Direct transfer from hotel to Ba Na Hills', 'Flexible waiting time options', 'Modern comfortable car', 'Local driver with great knowledge'],
    inclusions: ['Private vehicle', 'Bottled water', 'Tolls and parking fees'],
    exclusions: ['Ba Na Hills entrance tickets', 'Gratuities']
  },
  'hoi-an-to-danang-airport': {
    _id: '3', slug: 'hoi-an-to-danang-airport', name: 'Hoi An to Da Nang Airport', basePrice: 25, duration: '45 mins',
    description: 'Ensure a stress-free departure with our private transfer from your hotel in Hoi An directly to Da Nang International Airport. Punctual, reliable, and comfortable.',
    images: [
      'https://images.unsplash.com/photo-1504681869696-d977211867ff?w=800&q=80',
      'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=800&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'
    ],
    highlights: ['Punctual pickup', 'Assistance with luggage', 'Safe and reliable journey', 'Direct airport drop-off'],
    inclusions: ['Private vehicle', 'Luggage assistance', 'Tolls and airport access fees'],
    exclusions: ['Gratuities']
  }
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    try {
      await connectDB();
      const route = await Route.findOne({ slug, isActive: true }).lean();
      if (route) {
        return NextResponse.json({ success: true, data: route });
      }
    } catch (dbError) {
      console.error('[MongoDB Error]', dbError);
    }

    if (fallbackRoutes[slug]) {
      return NextResponse.json({ success: true, data: fallbackRoutes[slug] });
    }

    return NextResponse.json({ success: false, error: 'Route not found' }, { status: 404 });
  } catch (error) {
    console.error('[GET /api/routes/[slug]]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch route' }, { status: 500 });
  }
}

