import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

// Giới hạn kích thước file upload: 10MB
const MAX_SIZE_MB = 10;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'danang-transfer';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    const maxBytes = MAX_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { success: false, error: `File too large. Maximum size is ${MAX_SIZE_MB}MB.` },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary vào folder tương ứng (routes, blog, ...)
    const result = await uploadToCloudinary(buffer, `tour/${folder}`);

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    console.error('[POST /api/admin/upload]', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}

// Tăng giới hạn body size cho Next.js (mặc định 4MB)
export const config = {
  api: {
    bodyParser: false,
  },
};
