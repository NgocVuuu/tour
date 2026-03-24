import mongoose, { Schema, Document, Model } from 'mongoose';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentMethod = 'payoneer' | 'cash';
export type Currency = 'USD' | 'EUR' | 'AUD';

export interface IBooking extends Document {
  bookingCode: string;
  routeId: mongoose.Types.ObjectId;
  routeName: string;
  routeSlug: string;
  customerName: string;
  email: string;
  whatsapp: string;
  pickupAddress: string;
  dropoffAddress: string;
  flightNumber?: string;
  notes?: string;
  pax: number;
  carsRequired: number;
  basePrice: number;       // giá gốc mỗi xe (USD)
  totalPriceUSD: number;   // tổng tiền quy về USD
  totalPriceDisplay: number; // tổng tiền theo currency khách chọn
  currency: Currency;
  exchangeRate: number;    // tỷ giá tại thời điểm đặt
  paymentMethod: PaymentMethod;
  status: BookingStatus;
  transferDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

function generateBookingCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `DN-${num}`;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingCode: {
      type: String,
      unique: true,
      default: generateBookingCode,
    },
    routeId: { type: Schema.Types.ObjectId, ref: 'Route', required: true },
    routeName: { type: String, required: true },
    routeSlug: { type: String, required: true },
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    whatsapp: { type: String, required: true, trim: true },
    pickupAddress: { type: String, required: true, trim: true },
    dropoffAddress: { type: String, required: true, trim: true },
    flightNumber: { type: String, trim: true },
    notes: { type: String, trim: true },
    pax: { type: Number, required: true, min: 1 },
    carsRequired: { type: Number, required: true, min: 1 },
    basePrice: { type: Number, required: true },
    totalPriceUSD: { type: Number, required: true },
    totalPriceDisplay: { type: Number, required: true },
    currency: { type: String, enum: ['USD', 'EUR', 'AUD', 'VND'], default: 'USD' },
    exchangeRate: { type: Number, default: 1 },
    paymentMethod: { type: String, enum: ['payoneer', 'cash'], required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    transferDate: { type: Date, required: true },
  },
  { timestamps: true }
);

// Index để query nhanh theo status và ngày
BookingSchema.index({ status: 1, createdAt: -1 });
BookingSchema.index({ bookingCode: 1 });

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
