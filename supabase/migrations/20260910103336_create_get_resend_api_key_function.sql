/*
# Create function to retrieve Resend API key from vault

1. New Functions
- `get_resend_api_key()` — SECURITY DEFINER function that reads the
  RESEND_API_KEY secret from the vault schema and returns its decrypted value.
  Only callable by the service role (which the edge function uses).

2. Security
- SECURITY DEFINER so it can access the vault schema.
- REVOKE all from anon and authenticated; GRANT execute only to service_role.
  The anon key frontend cannot call this function.

3. Notes
- This function is used by the send-registration-email edge function
  to retrieve the Resend API key for sending confirmation emails.
- The vault schema is not directly accessible via the PostgREST API,
  so this function acts as a bridge.
*/

CREATE OR REPLACE FUNCTION public.get_resend_api_key()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  key_value text;
BEGIN
  SELECT decrypted_secret INTO key_value
  FROM vault.decrypted_secrets
  WHERE name = 'RESEND_API_KEY'
  LIMIT 1;

  RETURN key_value;
END;
$$;

REVOKE ALL ON FUNCTION public.get_resend_api_key() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_resend_api_key() TO service_role;
