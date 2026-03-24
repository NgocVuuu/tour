import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';

const SettingsSchema = z.object({
  exchangeRates: z
    .object({
      USD: z.number().default(1),
      EUR: z.number().min(0),
      AUD: z.number().min(0),
    })
    .optional(),
  payoneerAccount: z.string().optional(),
  bankTransferDetails: z.string().optional(),
  whatsappNumber: z.string().optional(),
  telegramBotToken: z.string().optional(),
  telegramChatId: z.string().optional(),
});

// GET /api/admin/settings
export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne().lean();
    if (!settings) {
      settings = await Settings.create({});
      settings = settings.toObject();
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('[GET /api/admin/settings]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT /api/admin/settings
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parsed = SettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 422 });
    }

    await connectDB();
    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: parsed.data },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('[PUT /api/admin/settings]', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
