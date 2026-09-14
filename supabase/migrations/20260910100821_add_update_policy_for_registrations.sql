/*
# Add UPDATE policy for registrations table

1. Security Changes
- Add UPDATE policy on `registrations` allowing anon + authenticated to update records.
- This is required because the payment flow (both demo and production Razorpay)
  needs to update `payment_status`, `payment_id`, and `registration_ref` after
  the registration record is created.
- Without this policy, RLS blocks all UPDATE operations and the payment
  confirmation step silently fails.

2. Notes
- The registration form has no sign-in, so the anon key client must be able
  to update the record it just created.
- In production, payment verification should happen server-side via an edge
  function using the service role key, which bypasses RLS entirely.
*/

DROP POLICY IF EXISTS "anon_update_registrations" ON registrations;
CREATE POLICY "anon_update_registrations"
ON registrations FOR UPDATE
TO anon, authenticated
USING (true) WITH CHECK (true);
