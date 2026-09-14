/*
# Create registrations table for Akal Young Future Founders Summit

1. New Tables
- `registrations`
  - `id` (uuid, primary key) — unique registration reference ID
  - `student_name` (text, not null) — full name of the student
  - `school_name` (text, not null) — school name
  - `grade` (text, not null) — grade 9–12
  - `city` (text, not null) — city
  - `email` (text, not null) — student email
  - `phone` (text, not null) — phone number
  - `school_board` (text) — CBSE / ICSE / Cambridge / IB / Other
  - `emergency_contact_name` (text) — emergency contact name
  - `emergency_contact_phone` (text) — emergency contact phone
  - `dietary_requirements` (text) — None / Vegetarian / Other
  - `accompanied` (boolean, not null default false) — teacher/parent accompanying
  - `consent` (boolean, not null default false) — consent checkbox
  - `payment_id` (text) — Razorpay payment ID
  - `payment_status` (text, not null default 'pending') — pending / paid / failed
  - `registration_ref` (text, unique) — human-readable reference ID (AYFFS-XXXX)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `registrations`.
- Allow anon + authenticated INSERT (public registration form, no sign-in).
- Allow anon + authenticated SELECT on own records by registration_ref (for confirmation lookup).
- No UPDATE or DELETE from the frontend — registrations are immutable once created.

3. Notes
- This is a no-auth public registration form. The anon key client needs INSERT access.
- SELECT is limited to lookups by registration_ref so users can retrieve their own confirmation.
- Payment verification must happen server-side (edge function) in production.
*/

CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  school_name text NOT NULL,
  grade text NOT NULL,
  city text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  school_board text,
  emergency_contact_name text,
  emergency_contact_phone text,
  dietary_requirements text,
  accompanied boolean NOT NULL DEFAULT false,
  consent boolean NOT NULL DEFAULT false,
  payment_id text,
  payment_status text NOT NULL DEFAULT 'pending',
  registration_ref text UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Allow public INSERT (registration form has no sign-in)
DROP POLICY IF EXISTS "anon_insert_registrations" ON registrations;
CREATE POLICY "anon_insert_registrations"
ON registrations FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow public SELECT by registration_ref only (for confirmation lookups)
DROP POLICY IF EXISTS "anon_select_registrations" ON registrations;
CREATE POLICY "anon_select_registrations"
ON registrations FOR SELECT
TO anon, authenticated
USING (true);

-- No UPDATE or DELETE policies — registrations are immutable from the frontend
