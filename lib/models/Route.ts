import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRoute extends Document {
  slug: string;
  name: string;
  description: string;
  basePrice: number; // USD
  duration: string;  // e.g. "45 mins"
  images: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RouteSchema = new Schema<IRoute>(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    basePrice: { type: Number, required: true, min: 0 },
    duration: { type: String, default: '' },
    images: [{ type: String }],
    highlights: [{ type: String }],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Route: Model<IRoute> =
  mongoose.models.Route || mongoose.model<IRoute>('Route', RouteSchema);

export default Route;
