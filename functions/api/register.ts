// POST /api/register — accepts multipart/form-data with registration fields
// and a required `payment_proof` PNG/JPG image. Stores the image in R2 and the
// record in D1.

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<unknown>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface R2Bucket {
  put(key: string, value: ArrayBuffer | ReadableStream, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
  delete(key: string): Promise<unknown>;
}

interface Env {
  DB: D1Database;
  PAYMENT_PROOFS: R2Bucket;
}

interface EventContext<E> {
  request: Request;
  env: E;
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
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  for (const b of bytes) ref += chars[b % chars.length];
  return `AFFS-${ref}`;
}

// Best-effort alert via ntfy.sh — free push notifications. Subscribe to the
// topic "affs-alerts-a7f3" in the ntfy app or at https://ntfy.sh to receive them.
async function notifyAdmin(title: string, message: string, priority = 'high'): Promise<void> {
  try {
    await fetch('https://ntfy.sh/affs-alerts-a7f3', {
      method: 'POST',
      headers: { Title: title, Priority: priority, Tags: 'warning' },
      body: message,
    });
  } catch { /* notification is best-effort — never fail the request */ }
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
  if (str('company')) {
    return json({ registration: { registration_ref: 'AFFS-RECEIVED' } });
  }

  const data = {
    student_name: str('student_name'),
    school_name: str('school_name'),
    grade: str('grade'),
    city: str('city'),
    email: str('email'),
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
  if (!/^[+]?[\d\s\-()]{10,15}$/.test(data.phone)) errors.phone = 'Valid phone number is required';
  if (data.emergency_contact_phone && !/^[+]?[\d\s\-()]{10,15}$/.test(data.emergency_contact_phone)) {
    errors.emergency_contact_phone = 'Valid phone number is required';
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
    await notifyAdmin(
      'AFFS proof upload failed',
      `R2 put failed for ${data.student_name} <${data.email}>: ${err instanceof Error ? err.message : String(err)}`
    );
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
      await notifyAdmin(
        'AFFS registration failed',
        `D1 insert failed for ${data.student_name} <${data.email}>: ${err instanceof Error ? err.message : String(err)}`
      );
      try { await context.env.PAYMENT_PROOFS.delete(proofPath); } catch { /* best effort */ }
      return json({ error: 'Failed to save registration. Please try again.' }, 500);
    }
  }

  console.log(`Registration saved: ${registrationRef} (${data.student_name} <${data.email}>)`);

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
