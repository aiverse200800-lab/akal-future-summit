/* Real ₹10 payment gate.
   The provided UPI QR is static and does not emit a server webhook. New registrations
   therefore remain pending until an authorized payment administrator verifies the
   received ₹10 and records the provider transaction ID through trusted backend/SQL. */

ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS payment_amount integer NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS payment_transaction_id text,
  ADD COLUMN IF NOT EXISTS payment_verified_at timestamptz;

UPDATE public.registrations
SET payment_amount = 10
WHERE payment_amount IS NULL OR payment_amount <> 10;

ALTER TABLE public.registrations
  DROP CONSTRAINT IF EXISTS registrations_payment_amount_check,
  ADD CONSTRAINT registrations_payment_amount_check CHECK (payment_amount = 10);

DROP POLICY IF EXISTS "anon_update_registrations" ON public.registrations;
DROP POLICY IF EXISTS "authenticated_update_registrations" ON public.registrations;

CREATE OR REPLACE FUNCTION public.admin_verify_payment(p_registration_id uuid, p_transaction_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF COALESCE(trim(p_transaction_id), '') = '' THEN
    RAISE EXCEPTION 'A verified transaction ID is required';
  END IF;

  UPDATE public.registrations
  SET payment_status = 'verified',
      payment_transaction_id = trim(p_transaction_id),
      payment_verified_at = COALESCE(payment_verified_at, now()),
      registration_status = 'payment_verified'
  WHERE id = p_registration_id
    AND payment_amount = 10
    AND payment_status <> 'verified';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Registration not found or payment is already verified';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_verify_payment(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_verify_payment(uuid, text) FROM anon;
REVOKE ALL ON FUNCTION public.admin_verify_payment(uuid, text) FROM authenticated;
