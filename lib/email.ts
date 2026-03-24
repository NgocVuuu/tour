import { Resend } from 'resend';
import { IBooking } from '@/lib/models/Booking';

const resend = new Resend(process.env.RESEND_API_KEY);

function buildEmailHtml(booking: IBooking): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://danangprivatetransfer.com';
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '84905555555';
  const transferDateStr = new Date(booking.transferDate).toLocaleString('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmation — ${booking.bookingCode}</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#ea580c,#f97316);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">DaNang Private Transfer</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Your booking is confirmed! 🎉</p>
            </td>
          </tr>

          <!-- Booking Code Banner -->
          <tr>
            <td style="background:#fff7ed;padding:20px 40px;text-align:center;border-bottom:1px solid #fed7aa;">
              <p style="margin:0;color:#9a3412;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Booking Reference</p>
              <p style="margin:8px 0 0;color:#ea580c;font-size:32px;font-weight:800;letter-spacing:2px;">${booking.bookingCode}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 8px;color:#374151;font-size:16px;">Hi <strong>${booking.customerName}</strong>,</p>
              <p style="margin:0 0 32px;color:#6b7280;font-size:15px;line-height:1.6;">
                Thank you for booking with us! Your transfer details are below. Please save this email for reference.
              </p>

              <!-- Transfer Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #e5e7eb;">
                    <p style="margin:0;color:#6b7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Transfer Details</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;color:#6b7280;font-size:13px;width:130px;">Route</td>
                        <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;">${booking.routeName}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#6b7280;font-size:13px;">Date & Time</td>
                        <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;">${transferDateStr}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#6b7280;font-size:13px;">Pickup</td>
                        <td style="padding:6px 0;color:#111827;font-size:14px;">${booking.pickupAddress}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#6b7280;font-size:13px;">Drop-off</td>
                        <td style="padding:6px 0;color:#111827;font-size:14px;">${booking.dropoffAddress}</td>
                      </tr>
                      ${booking.flightNumber ? `
                      <tr>
                        <td style="padding:6px 0;color:#6b7280;font-size:13px;">Flight No.</td>
                        <td style="padding:6px 0;color:#111827;font-size:14px;">${booking.flightNumber}</td>
                      </tr>` : ''}
                      <tr>
                        <td style="padding:6px 0;color:#6b7280;font-size:13px;">Passengers</td>
                        <td style="padding:6px 0;color:#111827;font-size:14px;">${booking.pax} pax → ${booking.carsRequired} private car(s)</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Payment Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;margin-bottom:32px;">
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #e5e7eb;">
                    <p style="margin:0;color:#6b7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Payment</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;color:#6b7280;font-size:13px;">Total Amount</td>
                        <td style="padding:6px 0;color:#ea580c;font-size:20px;font-weight:800;">${booking.totalPriceDisplay} ${booking.currency}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#6b7280;font-size:13px;">Method</td>
                        <td style="padding:6px 0;color:#111827;font-size:14px;">${booking.paymentMethod === 'cash' ? '💵 Cash to Driver' : '💳 Payoneer / Bank Transfer'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- WhatsApp CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="https://wa.me/${whatsapp}?text=Hi!%20My%20booking%20code%20is%20${booking.bookingCode}"
                       style="display:inline-block;background:#25D366;color:#ffffff;font-size:16px;font-weight:700;padding:16px 32px;border-radius:8px;text-decoration:none;">
                      💬 Message Us on WhatsApp to Confirm
                    </a>
                    <p style="margin:12px 0 0;color:#9ca3af;font-size:12px;">Our English-speaking team is online 24/7</p>
                  </td>
                </tr>
              </table>

              <!-- Footer note -->
              <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;border-top:1px solid #f3f4f6;padding-top:24px;">
                If you have any questions, reply to this email or contact us via WhatsApp. 
                Your driver will meet you at the pickup location with a personalized nameboard.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1f2937;padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#6b7280;font-size:12px;">
                © 2026 DaNang Private Transfer • <a href="${siteUrl}" style="color:#9ca3af;">danangprivatetransfer.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function sendBookingConfirmationEmail(booking: IBooking): Promise<void> {
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY not configured, skipping email.');
    return;
  }

  await resend.emails.send({
    from: `DaNang Private Transfer <${fromEmail}>`,
    to: booking.email,
    subject: `✅ Booking Confirmed — ${booking.bookingCode} | ${booking.routeName}`,
    html: buildEmailHtml(booking),
  });
}
