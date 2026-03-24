import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogPost extends Document {
  slug: string;
  title: string;
  content: string;       // HTML content từ WYSIWYG editor
  excerpt: string;       // mô tả ngắn cho SEO và listing page
  metaTitle: string;
  metaDescription: string;
  heroImage: string;     // URL ảnh bìa
  author: string;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
    excerpt: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    heroImage: { type: String, default: '' },
    author: { type: String, default: 'Admin' },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

BlogPostSchema.index({ isPublished: 1, publishedAt: -1 });
BlogPostSchema.index({ slug: 1 });

const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

export default BlogPost;
