// POST /api/register — accepts multipart/form-data with registration fields
// and a required `payment_proof` PNG/JPG image. Stores the image in R2 and the
// record in D1.

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface R2Bucket {
  put(key: string, value: ArrayBuffer | ReadableStream | string, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
  delete(key: string): Promise<unknown>;
  get(key: string): Promise<{ text(): Promise<string> } | null>;
}

interface Env {
  DB: D1Database;
  PAYMENT_PROOFS: R2Bucket;
  RESEND_API_KEY: string;
}

interface EventContext<E> {
  request: Request;
  env: E;
  waitUntil(promise: Promise<unknown>): void;
}

const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const EXT_BY_TYPE: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function makeRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = '';
  const bytes = crypto.getRandomValues(new Uint8Array(3));
  for (const b of bytes) ref += chars[b % chars.length];
  return `AFFS-${ref}`;
}

// Best-effort alerts: email via formsubmit.co (free relay; the recipient must
// confirm the first message) + push via ntfy.sh topic "affs-alerts-a7f3".
async function notifyAdmin(title: string, message: string): Promise<void> {
  try {
    await Promise.allSettled([
      fetch('https://formsubmit.co/ajax/imrishabh.work@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ _subject: `[AFFS] ${title}`, title, message }),
      }),
      fetch('https://ntfy.sh/affs-alerts-a7f3', {
        method: 'POST',
        headers: { Title: title, Priority: 'high', Tags: 'warning' },
        body: message,
      }),
    ]);
  } catch { /* notification is best-effort — never fail the request */ }
}

// Common domain misspellings → correct domain (only fix what is clearly a typo)
const DOMAIN_FIXES: Record<string, string> = {
  'gamil.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gmial.com': 'gmail.com',
  'gmaill.com': 'gmail.com', 'gmail.co': 'gmail.com', 'gmail.co.in': 'gmail.com',
  'gmail.cm': 'gmail.com', 'gmail.om': 'gmail.com', 'gmail.con': 'gmail.com',
  'gmalil.com': 'gmail.com', 'gmil.com': 'gmail.com', 'gimail.com': 'gmail.com',
  'ggmail.com': 'gmail.com', 'gmai.com': 'gmail.com',
  'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'yahho.com': 'yahoo.com',
  'yahoo.co': 'yahoo.com', 'yaho.co.in': 'yahoo.co.in', 'ymail.co': 'ymail.com',
  'hotmial.com': 'hotmail.com', 'hotmal.com': 'hotmail.com', 'hotmali.com': 'hotmail.com',
  'hotmail.co': 'hotmail.com', 'hotmail.cm': 'hotmail.com', 'hotmeil.com': 'hotmail.com',
  'outlok.com': 'outlook.com', 'outloook.com': 'outlook.com', 'outook.com': 'outlook.com',
  'outlook.co': 'outlook.com', 'outlook.cm': 'outlook.com', 'outlook.con': 'outlook.com',
  'iclod.com': 'icloud.com', 'iclud.com': 'icloud.com', 'icloud.co': 'icloud.com',
  'redifmail.com': 'rediffmail.com', 'rediffmil.com': 'rediffmail.com', 'redifmail.co.in': 'rediffmail.com',
};

function normalizeEmail(raw: string): string {
  let email = raw.trim().toLowerCase();
  // If user typed a stray "@" inside (e.g. abc@theite@gamil.com), keep the part
  // after the LAST "@" as the domain and the first part as the local name.
  const parts = email.split('@');
  if (parts.length > 2) {
    email = `${parts[0]}@${parts[parts.length - 1]}`;
  }
  const at = email.indexOf('@');
  if (at === -1) return email;
  const local = parts.length > 2 ? parts.slice(0, -1).join('') : email.slice(0, at);
  const domain = email.slice(at + 1);
  const fixed = DOMAIN_FIXES[domain] ?? domain;
  return `${local}@${fixed}`;
}

const SUMMIT_DATES = '22–23 October 2026';
const SUMMIT_VENUE = 'Akal Academy, Baru Sahib, Himachal Pradesh';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Akal+Academy+Baru+Sahib+Himachal+Pradesh';
const SUPPORT_EMAIL = 'admin@akalacademy.ac.in';
const SUPPORT_PHONE = '+91 99976 88579';
const SUPPORT_NAME = 'Kulpreet Kaur';

function receivedEmailHtml(name: string, ref: string): string {
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#FAF7F2;font-family:Arial,Helvetica,sans-serif;color:#292524">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <div style="background:#EA580C;border-radius:16px 16px 0 0;padding:28px 32px;color:#fff">
      <div style="font-size:11px;letter-spacing:2px;opacity:.85;text-transform:uppercase">Registration Received</div>
      <div style="font-size:22px;font-weight:bold;margin-top:6px">Akal Future Founders Summit</div>
      <div style="font-size:13px;margin-top:4px;opacity:.9">${SUMMIT_DATES} · 9:00 AM – 5:00 PM</div>
    </div>
    <div style="background:#fff;padding:28px 32px;border:1px solid #F3E8DB;border-top:none;border-radius:0 0 16px 16px">
      <p style="margin:0 0 16px;font-size:15px">Dear ${name},</p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.7">Thank you for registering for the <strong>Akal Future Founders Summit</strong>. We have received your registration and payment screenshot.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0">
        <tr><td style="padding:8px 0;color:#78716C;width:40%">Registration ID</td><td style="padding:8px 0;font-weight:bold">${ref}</td></tr>
        <tr><td style="padding:8px 0;color:#78716C">Dates</td><td style="padding:8px 0;font-weight:bold">${SUMMIT_DATES}</td></tr>
        <tr><td style="padding:8px 0;color:#78716C">Timings</td><td style="padding:8px 0;font-weight:bold">9:00 AM – 5:00 PM (both days)</td></tr>
        <tr><td style="padding:8px 0;color:#78716C">Venue</td><td style="padding:8px 0;font-weight:bold">${SUMMIT_VENUE}</td></tr>
      </table>
      <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:14px 16px;font-size:13px;line-height:1.7;color:#92400E;margin:8px 0 20px">
        <strong>What happens next:</strong> Our team is verifying your payment proof. Once verified, you will receive a confirmation email from us and your seat will be confirmed.
      </div>
      <a href="${MAPS_URL}" style="display:inline-block;background:#EA580C;color:#fff;text-decoration:none;font-size:14px;font-weight:bold;padding:12px 22px;border-radius:10px;margin:0 0 20px">View Location on Map</a>
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

async function sendReceivedEmail(env: Env, to: string, name: string, ref: string): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Akal Future Founders Summit <admin@akalfuturefounders.talentg.io>',
      to: [to],
      subject: `Registration Received — Akal Future Founders Summit (${ref})`,
      html: receivedEmailHtml(name, ref),
    }),
  });
  if (!res.ok) {
    console.error('Resend received-email failed:', res.status, await res.text());
  }
}

// Self-driving backup: on each registration request, if the last backup is
// older than 5 hours, dump the registrations table to R2. Cheap for small
// tables; keeps backups flowing without a separate worker.
const BACKUP_INTERVAL_MS = 5 * 60 * 60 * 1000;

async function maybeBackup(env: Env): Promise<void> {
  try {
    const marker = await env.PAYMENT_PROOFS.get('backups/.last-backup');
    const last = marker ? Number(await marker.text()) : 0;
    if (Date.now() - last < BACKUP_INTERVAL_MS) return;

    const rows = await env.DB.prepare('SELECT * FROM registrations').all();
    const stamp = new Date().toISOString().slice(0, 10);
    await env.PAYMENT_PROOFS.put(`backups/registrations-${stamp}.json`, JSON.stringify(rows.results ?? []), {
      httpMetadata: { contentType: 'application/json' },
    });
    await env.PAYMENT_PROOFS.put('backups/.last-backup', String(Date.now()), {
      httpMetadata: { contentType: 'text/plain' },
    });
  } catch { /* backup is best-effort */ }
}

export async function onRequestPost(context: EventContext<Env>): Promise<Response> {
  let form: FormData;
  try {
    form = await context.request.formData();
  } catch {
    return json({ error: 'Invalid form submission.' }, 400);
  }

  const str = (name: string) => (form.get(name) as string | null)?.trim() ?? '';

  // Honeypot: bots fill hidden fields, humans never see it. Pretend success.
  if (str('website')) {
    return json({ registration: { registration_ref: 'AFFS-RECEIVED' } });
  }

  const data = {
    student_name: str('student_name'),
    school_name: str('school_name'),
    grade: str('grade'),
    city: str('city'),
    email: normalizeEmail(str('email')),
    phone: str('phone'),
    school_board: str('school_board'),
    emergency_contact_name: str('emergency_contact_name'),
    emergency_contact_phone: str('emergency_contact_phone'),
    accompanied: str('accompanied') === 'true',
    consent: str('consent') === 'true',
  };

  const errors: Record<string, string> = {};
  if (!data.student_name) errors.student_name = 'Student name is required';
  if (!data.school_name) errors.school_name = 'School name is required';
  if (!data.grade) errors.grade = 'Grade is required';
  if (!data.city) errors.city = 'City is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Valid email is required';
  if (!/^\d{10}$/.test(data.phone)) errors.phone = 'Valid 10-digit phone number is required';
  if (data.emergency_contact_phone && !/^\d{10}$/.test(data.emergency_contact_phone)) {
    errors.emergency_contact_phone = 'Valid 10-digit phone number is required';
  }
  if (!data.consent) errors.consent = 'Consent is required';

  const file = form.get('payment_proof');
  if (!(file instanceof File) || file.size === 0) {
    errors.payment_proof = 'Payment screenshot is required';
  } else if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    errors.payment_proof = 'Payment screenshot must be a PNG or JPG image.';
  } else if (file.size > MAX_FILE_SIZE) {
    errors.payment_proof = 'Payment screenshot must be under 5 MB.';
  }
  if (Object.keys(errors).length) return json({ error: 'Validation failed', fields: errors }, 422);

  let proofPath: string | null = null;

  const id = crypto.randomUUID();
  let registrationRef = makeRef();

  proofPath = `proofs/${registrationRef}.${EXT_BY_TYPE[(file as File).type]}`;
  const fileBuffer = await (file as File).arrayBuffer();
  try {
    await context.env.PAYMENT_PROOFS.put(proofPath, fileBuffer, {
      httpMetadata: { contentType: (file as File).type },
    });
  } catch (err) {
    console.error('R2 upload failed:', err);
    context.waitUntil(notifyAdmin(
      'AFFS proof upload failed',
      `R2 put failed for ${data.student_name} <${data.email}>: ${err instanceof Error ? err.message : String(err)}`
    ));
    return json({ error: 'Failed to save registration. Please try again.' }, 500);
  }

  let inserted = false;
  for (let attempt = 0; attempt < 3 && !inserted; attempt++) {
    try {
      await context.env.DB.prepare(
        `INSERT INTO registrations
          (id, student_name, school_name, grade, city, email, phone, school_board,
           emergency_contact_name, emergency_contact_phone, accompanied, consent,
           payment_proof_path, proof_status, registration_ref)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          id, data.student_name, data.school_name, data.grade, data.city,
          data.email, data.phone, data.school_board || null,
          data.emergency_contact_name || null, data.emergency_contact_phone || null,
          data.accompanied ? 1 : 0, data.consent ? 1 : 0,
          proofPath, 'submitted', registrationRef
        )
        .run();
      inserted = true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/UNIQUE|unique/i.test(msg) && attempt < 2) {
        try { await context.env.PAYMENT_PROOFS.delete(proofPath); } catch { /* best effort */ }
        registrationRef = makeRef();
        proofPath = `proofs/${registrationRef}.${EXT_BY_TYPE[(file as File).type]}`;
        await context.env.PAYMENT_PROOFS.put(proofPath, fileBuffer, {
          httpMetadata: { contentType: (file as File).type },
        });
        continue;
      }
      console.error('D1 insert failed:', err);
      context.waitUntil(notifyAdmin(
        'AFFS registration failed',
        `D1 insert failed for ${data.student_name} <${data.email}>: ${err instanceof Error ? err.message : String(err)}`
      ));
      try { await context.env.PAYMENT_PROOFS.delete(proofPath); } catch { /* best effort */ }
      return json({ error: 'Failed to save registration. Please try again.' }, 500);
    }
  }

  console.log(`Registration saved: ${registrationRef} (${data.student_name} <${data.email}>)`);

  context.waitUntil(sendReceivedEmail(context.env, data.email, data.student_name, registrationRef));
  context.waitUntil(maybeBackup(context.env));

  return json({
    registration: {
      id,
      ...data,
      registration_ref: registrationRef,
      payment_proof_path: proofPath,
      created_at: new Date().toISOString(),
    },
  });
}
