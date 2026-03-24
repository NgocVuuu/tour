import { IBooking } from '@/lib/models/Booking';

function formatTelegramMessage(booking: IBooking): string {
  const statusEmoji = '🔔';
  const carEmoji = booking.carsRequired > 1 ? '🚗🚗' : '🚗';

  const title = booking.routeId?.toString() === 'custom' 
    ? `*🚨 YÊU CẦU BÁO GIÁ — ${booking.bookingCode}*` 
    : `*NEW BOOKING — ${booking.bookingCode}*`;

  return `${statusEmoji} ${title}
👤 *Customer:* ${booking.customerName}
📱 *WhatsApp:* ${booking.whatsapp}
📧 *Email:* ${booking.email}

${carEmoji} *Route:* ${booking.routeName}
📍 *Pickup:* ${booking.pickupAddress}
🏁 *Dropoff:* ${booking.dropoffAddress}
✈️ *Flight:* ${booking.flightNumber || 'N/A'}
📅 *Date/Time:* ${new Date(booking.transferDate).toLocaleString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh' })}
👥 *Pax:* ${booking.pax} → ${booking.carsRequired} car(s)

💰 *Total:* ${booking.totalPriceDisplay} ${booking.currency} ($${booking.totalPriceUSD} USD)
💳 *Payment:* ${booking.paymentMethod === 'cash' ? 'Cash to Driver' : 'Payoneer/Bank Transfer'}

${booking.notes ? `📝 *Notes:* ${booking.notes}` : ''}

→ Confirm at: ${process.env.NEXT_PUBLIC_SITE_URL}/admin/bookings`;
}

export async function sendTelegramNotification(booking: IBooking): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('[Telegram] Bot token or chat ID not configured, skipping notification.');
    return;
  }

  const message = formatTelegramMessage(booking);
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram API error: ${error}`);
  }
}
