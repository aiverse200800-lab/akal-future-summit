import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

function bytesToHex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== 'POST') return response({ error: 'Method not allowed' }, 405);

  try {
    const form = await req.formData();
    const registrationId = String(form.get('registrationId') || '');
    const paymentToken = String(form.get('paymentToken') || '');
    const file = form.get('file');
    if (!registrationId || !paymentToken || !(file instanceof File)) return response({ error: 'Registration ID, payment token, and payment proof are required.' }, 400);
    if (!ALLOWED_TYPES.has(file.type)) return response({ error: 'Please upload a JPG, JPEG, PNG, WEBP, or PDF file.' }, 400);
    if (file.size <= 0 || file.size > MAX_FILE_SIZE) return response({ error: 'File is too large. Please choose a file up to 5 MB.' }, 400);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) return response({ error: 'Payment proof service is not configured.' }, 500);
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const tokenHash = bytesToHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(paymentToken)));
    const { data: registration, error: lookupError } = await supabase.from('registrations').select('id, registration_ref, payment_status, proof_status').eq('id', registrationId).eq('payment_access_token_hash', tokenHash).maybeSingle();
    if (lookupError) return response({ error: 'Could not verify registration. Please try again.' }, 500);
    if (!registration) return response({ error: 'Registration session is invalid or expired.' }, 403);
    if (registration.proof_status === 'uploaded' || registration.payment_status === 'proof_submitted') return response({ error: 'Payment proof has already been submitted for this registration.' }, 409);

    const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80) || 'payment-proof';
    const path = `${registration.registration_ref}/${crypto.randomUUID()}-${originalName}`;
    const { error: uploadError } = await supabase.storage.from('payment-proofs').upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) return response({ error: 'Payment proof could not be uploaded. Please try again.' }, 500);

    const submittedAt = new Date().toISOString();
    const { error: updateError } = await supabase.from('registrations').update({ payment_proof_path: path, payment_submitted_at: submittedAt, payment_status: 'proof_submitted', proof_status: 'uploaded', registration_status: 'verification_pending' }).eq('id', registrationId).eq('payment_access_token_hash', tokenHash);
    if (updateError) {
      await supabase.storage.from('payment-proofs').remove([path]);
      return response({ error: 'Payment proof could not be linked to the registration. Please try again.' }, 500);
    }

    return response({ success: true, path, payment_submitted_at: submittedAt });
  } catch (error) {
    console.error('submit-payment-proof error', error);
    return response({ error: error instanceof Error ? error.message : 'Payment proof submission failed.' }, 500);
  }
});
