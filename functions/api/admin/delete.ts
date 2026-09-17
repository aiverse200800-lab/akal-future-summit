// POST /api/admin/delete — bulk delete registrations + their R2 proof files.
// Body: { refs: string[] }
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<unknown>;
  all<T = unknown>(): Promise<{ results: T[] }>;
}
interface D1Database { prepare(query: string): D1PreparedStatement; }
interface R2Bucket { delete(key: string): Promise<unknown>; }
interface Env { DB: D1Database; PAYMENT_PROOFS: R2Bucket; ADMIN_CODE: string; }
interface EventContext<E> { request: Request; env: E; }

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(context: EventContext<Env>): Promise<Response> {
  const code = context.request.headers.get('x-admin-code') ?? '';
  if (code !== context.env.ADMIN_CODE) {
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: { refs?: string[] };
  try {
    body = await context.request.json();
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }
  const refs = (body.refs ?? []).filter((r) => /^AFFS-[A-Z0-9]+$/.test(r));
  if (!refs.length) return json({ error: 'No valid refs' }, 400);

  // Fetch proof paths before deleting so we can clean up R2
  const placeholders = refs.map(() => '?').join(',');
  const { results } = await context.env.DB.prepare(
    `SELECT payment_proof_path FROM registrations WHERE registration_ref IN (${placeholders})`
  ).bind(...refs).all<{ payment_proof_path: string | null }>();

  await context.env.DB.prepare(
    `DELETE FROM registrations WHERE registration_ref IN (${placeholders})`
  ).bind(...refs).run();

  for (const r of results) {
    if (r.payment_proof_path) {
      try { await context.env.PAYMENT_PROOFS.delete(r.payment_proof_path); } catch { /* best effort */ }
    }
  }

  return json({ ok: true, deleted: refs.length });
}
