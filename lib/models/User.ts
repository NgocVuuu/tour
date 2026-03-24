import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email?: string;
  image?: string;
  emailVerified?: Date;
  whatsapp?: string;
  role: 'customer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: false },
    email: { type: String, required: false, unique: true, sparse: true },
    image: { type: String, required: false },
    emailVerified: { type: Date, required: false },
    whatsapp: { type: String, required: false },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
