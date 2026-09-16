import { createClient } from 'npm:@supabase/supabase-js@2';

const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const constantTimeEqual = (a: string, b: string) => {
  const aa = new TextEncoder().encode(a); const bb = new TextEncoder().encode(b);
  if (aa.length !== bb.length) return false;
  let diff = 0; for (let i = 0; i < aa.length; i++) diff |= aa[i] ^ bb[i];
  return diff === 0;
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') return response({ error: 'Method not allowed' }, 405);
  try {
    const secret = Deno.env.get('UPI_WEBHOOK_SECRET');
    if (!secret) return response({ error: 'Webhook is not configured.' }, 503);
    const signature = req.headers.get('x-upi-webhook-signature') || '';
    if (!signature || !constantTimeEqual(signature, secret)) return response({ error: 'Invalid webhook signature.' }, 401);

    const payload = await req.json();
    // Normalize common UPI/gateway webhook field names. The gateway must send a
    // trusted successful-payment event, transaction/UTR, and amount in INR.
    const event = String(payload.event || payload.status || '').toLowerCase();
    const status = String(payload.status || payload.payment_status || '').toLowerCase();
    const success = ['payment_success','payment.succeeded','success','successful','paid','captured'].includes(event) || ['success','successful','paid','captured'].includes(status);
    const amount = Number(payload.amount ?? payload.payment_amount ?? payload.data?.amount ?? 0);
    const transactionId = String(payload.utr ?? payload.transaction_id ?? payload.txn_id ?? payload.data?.utr ?? payload.data?.transaction_id ?? '').trim();
    if (!success || amount !== 10 || !transactionId) return response({ accepted: false, error: 'Unverified or incomplete payment event.' }, 400);

    const url = Deno.env.get('SUPABASE_URL');
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) return response({ error: 'Supabase service is not configured.' }, 500);
    const supabase = createClient(url, key);
    const { data: registration, error: lookupError } = await supabase.from('registrations').select('id,payment_amount,payment_status,payment_transaction_id').eq('payment_transaction_id', transactionId).maybeSingle();
    if (lookupError) return response({ error: 'Could not look up payment.' }, 500);
    if (!registration) return response({ accepted: false, error: 'No registration is awaiting this transaction ID.' }, 404);
    if (Number(registration.payment_amount) !== 10) return response({ accepted: false, error: 'Payment amount mismatch.' }, 400);
    if (registration.payment_status === 'verified') return response({ accepted: true, payment_status: 'verified' });

    const { error: updateError } = await supabase.from('registrations').update({ payment_status: 'verified', payment_verified_at: new Date().toISOString(), registration_status: 'payment_verified' }).eq('id', registration.id).eq('payment_status', 'pending');
    if (updateError) return response({ error: 'Could not finalize payment.' }, 500);
    return response({ accepted: true, payment_status: 'verified', registration_id: registration.id, transaction_id: transactionId });
  } catch (error) {
    console.error('upi-payment-webhook error', error);
    return response({ error: 'Invalid webhook request.' }, 400);
  }
});
