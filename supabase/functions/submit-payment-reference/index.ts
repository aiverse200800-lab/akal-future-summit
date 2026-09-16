import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};
const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== 'POST') return response({ error: 'Method not allowed' }, 405);
  try {
    const { registrationId, paymentToken, transactionId } = await req.json();
    if (!registrationId || !paymentToken || !transactionId) return response({ error: 'Registration ID, payment token and transaction ID are required.' }, 400);
    const url = Deno.env.get('SUPABASE_URL');
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) return response({ error: 'Payment service is not configured.' }, 500);
    const supabase = createClient(url, key);
    const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(paymentToken))))).map((b) => b.toString(16).padStart(2, '0')).join('');
    const { data, error } = await supabase.from('registrations').select('id,payment_status,payment_amount').eq('id', String(registrationId)).eq('payment_access_token_hash', hash).maybeSingle();
    if (error) return response({ error: 'Could not verify registration.' }, 500);
    if (!data) return response({ error: 'Registration session is invalid or expired.' }, 403);
    if (data.payment_status === 'verified') return response({ payment_status: 'verified' });
    const cleanId = String(transactionId).trim().slice(0, 120);
    const { error: updateError } = await supabase.from('registrations').update({ payment_transaction_id: cleanId, payment_submitted_at: new Date().toISOString() }).eq('id', String(registrationId));
    if (updateError) return response({ error: 'Could not save transaction ID.' }, 500);
    return response({ payment_status: 'pending', payment_transaction_id: cleanId });
  } catch (error) {
    console.error('submit-payment-reference error', error);
    return response({ error: 'Could not submit transaction ID.' }, 500);
  }
});
