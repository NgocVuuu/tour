import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

/**
 * Upload a file buffer to Cloudinary
 * @param buffer - File buffer
 * @param folder - Cloudinary folder (e.g. 'routes', 'blog')
 * @param publicId - Optional custom public_id
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = 'tour',
  publicId?: string
): Promise<{ url: string; publicId: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const options: Record<string, unknown> = {
      folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    };
    if (publicId) options.public_id = publicId;

    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        });
      })
      .end(buffer);
  });
}

/**
 * Delete an image from Cloudinary by public_id
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
