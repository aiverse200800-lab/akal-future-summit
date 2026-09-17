// POST /api/admin/status — verify or reject a registration's payment proof.
// Body: { ref: string, status: 'verified' | 'rejected' }
// On 'verified', sends a confirmation email via Resend.
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<unknown>;
}
interface D1Database { prepare(query: string): D1PreparedStatement; }
interface Env { DB: D1Database; ADMIN_CODE: string; RESEND_API_KEY: string; }
interface EventContext<E> { request: Request; env: E; waitUntil(p: Promise<unknown>): void; }

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const SUMMIT_DATES = '22–23 October 2026';
const SUMMIT_VENUE = 'Akal Academy, Baru Sahib, Himachal Pradesh';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Akal+Academy+Baru+Sahib+Himachal+Pradesh';
const SUPPORT_EMAIL = 'admin@akalacademy.ac.in';
const SUPPORT_PHONE = '+91 99976 88579';
const SUPPORT_NAME = 'Kulpreet Kaur';

function confirmationEmailHtml(name: string, ref: string): string {
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#FAF7F2;font-family:Arial,Helvetica,sans-serif;color:#292524">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <div style="background:#EA580C;border-radius:16px 16px 0 0;padding:28px 32px;color:#fff">
      <div style="font-size:11px;letter-spacing:2px;opacity:.85;text-transform:uppercase">Registration Confirmed</div>
      <div style="font-size:22px;font-weight:bold;margin-top:6px">Akal Future Founders Summit</div>
      <div style="font-size:13px;margin-top:4px;opacity:.9">${SUMMIT_DATES} · 9:00 AM – 5:00 PM</div>
    </div>
    <div style="background:#fff;padding:28px 32px;border:1px solid #F3E8DB;border-top:none;border-radius:0 0 16px 16px">
      <p style="margin:0 0 16px;font-size:15px">Dear ${name},</p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.7">Congratulations — your payment has been verified and your seat at the <strong>Akal Future Founders Summit</strong> is now <strong>confirmed</strong>.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0">
        <tr><td style="padding:8px 0;color:#78716C;width:40%">Registration ID</td><td style="padding:8px 0;font-weight:bold">${ref}</td></tr>
        <tr><td style="padding:8px 0;color:#78716C">Dates</td><td style="padding:8px 0;font-weight:bold">${SUMMIT_DATES}</td></tr>
        <tr><td style="padding:8px 0;color:#78716C">Timings</td><td style="padding:8px 0;font-weight:bold">9:00 AM – 5:00 PM (both days)</td></tr>
        <tr><td style="padding:8px 0;color:#78716C">Venue</td><td style="padding:8px 0;font-weight:bold">${SUMMIT_VENUE}</td></tr>
      </table>
      <a href="${MAPS_URL}" style="display:inline-block;background:#EA580C;color:#fff;text-decoration:none;font-size:14px;font-weight:bold;padding:12px 22px;border-radius:10px;margin:8px 0 20px">View Location on Map</a>
      <p style="margin:0 0 4px;font-size:13px;color:#78716C">Please bring your school ID and this confirmation email.</p>
      <hr style="border:none;border-top:1px solid #F3E8DB;margin:24px 0"/>
      <p style="margin:0;font-size:13px;line-height:1.7;color:#44403C">
        Regards,<br/>
        <strong>${SUPPORT_NAME}</strong><br/>
        Registration Desk, Akal Future Founders Summit<br/>
        <a href="mailto:${SUPPORT_EMAIL}" style="color:#EA580C;text-decoration:none">${SUPPORT_EMAIL}</a><br/>
        <a href="tel:${SUPPORT_PHONE.replace(/\s/g, '')}" style="color:#EA580C;text-decoration:none">${SUPPORT_PHONE}</a>
      </p>
    </div>
    <p style="font-size:11px;color:#A8A29E;text-align:center;margin:16px 0 0">Akal Academy Baru Sahib — 40th Foundation Day · In collaboration with AIC ISB Mohali</p>
  </div>
</body></html>`;
}

async function sendConfirmation(env: Env, to: string, name: string, ref: string): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Akal Future Founders Summit <admin@akalfuturefounders.talentg.io>',
      to: [to],
      subject: `Seat Confirmed — Akal Future Founders Summit (${ref})`,
      html: confirmationEmailHtml(name, ref),
    }),
  });
  if (!res.ok) {
    console.error('Resend failed:', res.status, await res.text());
  }
}

export async function onRequestPost(context: EventContext<Env>): Promise<Response> {
  const code = context.request.headers.get('x-admin-code') ?? '';
  if (code !== context.env.ADMIN_CODE) {
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: { ref?: string; status?: string };
  try {
    body = await context.request.json();
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }
  const { ref, status } = body;
  if (!ref || !['verified', 'rejected', 'submitted'].includes(status ?? '')) {
    return json({ error: 'Invalid ref or status' }, 400);
  }

  const row = await context.env.DB.prepare(
    'SELECT student_name, email FROM registrations WHERE registration_ref = ?'
  ).bind(ref).first<{ student_name: string; email: string }>();
  if (!row) return json({ error: 'Not found' }, 404);

  await context.env.DB.prepare(
    'UPDATE registrations SET proof_status = ? WHERE registration_ref = ?'
  ).bind(status, ref).run();

  if (status === 'verified' && row.email) {
    context.waitUntil(sendConfirmation(context.env, row.email, row.student_name, ref));
  }

  return json({ ok: true, ref, status });
}
