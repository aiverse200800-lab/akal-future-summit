/*
# Fix get_resend_api_key function security

1. Security Changes
- REVOKE execute from anon and authenticated on get_resend_api_key()
- The function was previously callable by anon/authenticated which would
  expose the Resend API key to anyone. Now only service_role can call it.
- Set search_path to 'public, vault' to prevent search_path injection.

2. Notes
- The edge function uses the service role key, which bypasses RLS and
  can call this function. The anon key frontend cannot.
*/

DROP FUNCTION IF EXISTS public.get_resend_api_key();

CREATE OR REPLACE FUNCTION public.get_resend_api_key()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, vault
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
