import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettings extends Document {
  exchangeRates: {
    USD: number;
    EUR: number;
    AUD: number;
    VND: number;
  };
  payoneerAccount: string;
  bankTransferDetails: string; // hướng dẫn chuyển khoản, hiển thị trên checkout
  whatsappNumber: string;      // format: 84905555555 (không có +)
  telegramBotToken: string;
  telegramChatId: string;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    exchangeRates: {
      USD: { type: Number, default: 1 },
      EUR: { type: Number, default: 0.92 },
      AUD: { type: Number, default: 1.58 },
      VND: { type: Number, default: 25400 },
    },
    payoneerAccount: { type: String, default: '' },
    bankTransferDetails: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    telegramBotToken: { type: String, default: '' },
    telegramChatId: { type: String, default: '' },
  },
  { timestamps: true }
);

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
