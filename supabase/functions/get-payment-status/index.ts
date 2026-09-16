import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const response = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const bytesToHex = (bytes: ArrayBuffer) =>
  Array.from(new Uint8Array(bytes)).map((b) => b.toString(16).padStart(2, '0')).join('');

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== 'POST') return response({ error: 'Method not allowed' }, 405);

  try {
    const { registrationId, paymentToken } = await req.json();
    if (!registrationId || !paymentToken) {
      return response({ error: 'Registration ID and payment token are required.' }, 400);
    }

    const url = Deno.env.get('SUPABASE_URL');
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) return response({ error: 'Payment status service is not configured.' }, 500);

    const supabase = createClient(url, key);
    const tokenHash = bytesToHex(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(paymentToken))),
    );

    const { data: registration, error } = await supabase
      .from('registrations')
      .select('payment_amount,payment_status,payment_transaction_id,payment_verified_at,proof_status,registration_status,payment_proof_path,payment_submitted_at,completed_at')
      .eq('id', String(registrationId))
      .eq('payment_access_token_hash', tokenHash)
      .maybeSingle();

    if (error) return response({ error: 'Could not verify registration. Please try again.' }, 500);
    if (!registration) return response({ error: 'Registration session is invalid or expired.' }, 403);

    return response({
      payment_amount: Number(registration.payment_amount || 10),
      payment_status: registration.payment_status,
      payment_transaction_id: registration.payment_transaction_id,
      payment_verified_at: registration.payment_verified_at,
      proof_status: registration.proof_status,
      registration_status: registration.registration_status,
      payment_proof_path: registration.payment_proof_path,
      payment_submitted_at: registration.payment_submitted_at,
      completed_at: registration.completed_at,
    });
  } catch (error) {
    console.error('get-payment-status error', error);
    return response({ error: 'Could not check payment status. Please try again.' }, 500);
  }
});
