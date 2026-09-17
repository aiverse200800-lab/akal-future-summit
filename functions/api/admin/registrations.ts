// GET /api/admin/registrations — returns all registration rows for the admin
// portal. Gated by the ADMIN_CODE env var; rate-limited per IP via D1.
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}
interface D1Database { prepare(query: string): D1PreparedStatement; }
interface Env { DB: D1Database; ADMIN_CODE: string; }
interface EventContext<E> { request: Request; env: E; }

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestGet(context: EventContext<Env>): Promise<Response> {
  const ip = context.request.headers.get('cf-connecting-ip') ?? 'unknown';
  const now = Date.now();

  // Rate limit: max 5 attempts per IP per 10-minute window
  const row = await context.env.DB.prepare(
    'SELECT attempts, window_start FROM admin_attempts WHERE ip = ?'
  ).bind(ip).first<{ attempts: number; window_start: number }>();

  if (row && now - row.window_start < WINDOW_MS && row.attempts >= MAX_ATTEMPTS) {
    return json({ error: 'Too many attempts. Try again later.' }, 429);
  }

  const code = context.request.headers.get('x-admin-code') ?? '';
  if (code !== context.env.ADMIN_CODE) {
    if (row && now - row.window_start < WINDOW_MS) {
      await context.env.DB.prepare(
        'UPDATE admin_attempts SET attempts = attempts + 1 WHERE ip = ?'
      ).bind(ip).run();
    } else {
      await context.env.DB.prepare(
        'INSERT OR REPLACE INTO admin_attempts (ip, attempts, window_start) VALUES (?, 1, ?)'
      ).bind(ip, now).run();
    }
    return json({ error: 'Invalid access code.' }, 401);
  }

  const { results } = await context.env.DB.prepare(
    `SELECT registration_ref, student_name, school_name, grade, city, email,
            phone, school_board, emergency_contact_name, emergency_contact_phone,
            accompanied, consent, proof_status, payment_proof_path, created_at
     FROM registrations ORDER BY created_at DESC`
  ).all();

  return json({ registrations: results });
}
