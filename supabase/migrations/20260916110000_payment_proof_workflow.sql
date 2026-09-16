/* Payment QR + proof workflow for AFFS.
   The public client can create a registration through one SECURITY DEFINER RPC.
   Proof files are uploaded only by the server-side edge function using the
   service-role key; the storage bucket remains private. */

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS proof_status text NOT NULL DEFAULT 'not_uploaded',
  ADD COLUMN IF NOT EXISTS registration_status text NOT NULL DEFAULT 'payment_pending',
  ADD COLUMN IF NOT EXISTS payment_proof_path text,
  ADD COLUMN IF NOT EXISTS payment_submitted_at timestamptz,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_access_token_hash text;

ALTER TABLE registrations DROP COLUMN IF EXISTS dietary_requirements;

UPDATE registrations
SET proof_status = COALESCE(NULLIF(proof_status, ''), 'not_uploaded'),
    registration_status = CASE
      WHEN payment_status = 'paid' THEN 'completed'
      ELSE COALESCE(NULLIF(registration_status, ''), 'payment_pending')
    END;

-- The old frontend policies exposed every registration and allowed arbitrary updates.
DROP POLICY IF EXISTS "anon_select_registrations" ON registrations;
DROP POLICY IF EXISTS "anon_update_registrations" ON registrations;
DROP POLICY IF EXISTS "authenticated_update_registrations" ON registrations;
DROP POLICY IF EXISTS "anon_insert_registrations" ON registrations;

CREATE POLICY "anon_insert_registrations" ON registrations
  FOR INSERT TO anon, authenticated
  WITH CHECK (false);

-- All public registration creation now goes through create_registration().
CREATE OR REPLACE FUNCTION create_registration(p_data jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_id uuid := gen_random_uuid();
  v_token text := encode(gen_random_bytes(32), 'hex');
  v_ref text := 'AFFS-' || upper(substr(replace(v_id::text, '-', ''), 1, 8));
  v_row registrations%ROWTYPE;
BEGIN
  IF COALESCE(trim(p_data->>'student_name'), '') = ''
     OR COALESCE(trim(p_data->>'school_name'), '') = ''
     OR COALESCE(trim(p_data->>'grade'), '') = ''
     OR COALESCE(trim(p_data->>'city'), '') = ''
     OR COALESCE(trim(p_data->>'email'), '') = ''
     OR COALESCE(trim(p_data->>'phone'), '') = ''
     OR COALESCE((p_data->>'consent')::boolean, false) = false THEN
    RAISE EXCEPTION 'Required registration information is missing';
  END IF;

  INSERT INTO registrations (
    id, student_name, school_name, grade, city, email, phone,
    school_board, emergency_contact_name, emergency_contact_phone,
    accompanied, consent, payment_status, proof_status,
    registration_status, registration_ref, payment_access_token_hash
  ) VALUES (
    v_id,
    trim(p_data->>'student_name'), trim(p_data->>'school_name'), trim(p_data->>'grade'),
    trim(p_data->>'city'), trim(p_data->>'email'), trim(p_data->>'phone'),
    NULLIF(trim(p_data->>'school_board'), ''),
    NULLIF(trim(p_data->>'emergency_contact_name'), ''),
    NULLIF(trim(p_data->>'emergency_contact_phone'), ''),
    COALESCE((p_data->>'accompanied')::boolean, false),
    COALESCE((p_data->>'consent')::boolean, false),
    'pending', 'not_uploaded', 'payment_pending', v_ref,
    encode(digest(v_token, 'sha256'), 'hex')
  ) RETURNING * INTO v_row;

  RETURN jsonb_build_object(
    'registration', to_jsonb(v_row) - 'payment_access_token_hash',
    'payment_token', v_token
  );
END;
$$;

REVOKE ALL ON FUNCTION create_registration(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION create_registration(jsonb) TO anon, authenticated;

-- No public SELECT/UPDATE/DELETE policy is intentionally provided.
-- The service-role edge function performs proof upload and status transitions.

INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO UPDATE SET public = false;

DROP POLICY IF EXISTS "payment_proofs_public_read" ON storage.objects;
DROP POLICY IF EXISTS "payment_proofs_public_insert" ON storage.objects;
DROP POLICY IF EXISTS "payment_proofs_public_update" ON storage.objects;
DROP POLICY IF EXISTS "payment_proofs_public_delete" ON storage.objects;
