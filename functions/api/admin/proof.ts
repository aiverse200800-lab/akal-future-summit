// GET /api/admin/proof?path=proofs/AFFS-XXXX.png — streams a payment screenshot
// from R2 for the admin portal. Requires x-admin-code header.
interface R2Object { body: ReadableStream | null; httpMetadata?: { contentType?: string } }
interface R2Bucket { get(key: string): Promise<R2Object | null>; }
interface Env { PAYMENT_PROOFS: R2Bucket; ADMIN_CODE: string; }
interface EventContext<E> { request: Request; env: E; }

export async function onRequestGet(context: EventContext<Env>): Promise<Response> {
  const code = context.request.headers.get('x-admin-code') ?? '';
  if (code !== context.env.ADMIN_CODE) {
    return new Response('Unauthorized', { status: 401 });
  }

  const path = new URL(context.request.url).searchParams.get('path') ?? '';
  if (!/^proofs\/[A-Za-z0-9._-]+$/.test(path)) {
    return new Response('Invalid path', { status: 400 });
  }

  const obj = await context.env.PAYMENT_PROOFS.get(path);
  if (!obj?.body) return new Response('Not found', { status: 404 });

  return new Response(obj.body, {
    headers: {
      'Content-Type': obj.httpMetadata?.contentType ?? 'application/octet-stream',
      'Cache-Control': 'private, max-age=300',
    },
  });
}
