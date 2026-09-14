/*
# Create email_queue table for registration confirmation emails

1. New Tables
- `email_queue`
  - `id` (uuid, primary key)
  - `registration_id` (uuid, nullable, references registrations)
  - `recipient_email` (text, not null) — student email address
  - `recipient_name` (text, not null) — student name
  - `registration_ref` (text, nullable) — human-readable registration reference
  - `subject` (text, not null) — email subject line
  - `body_html` (text, not null) — full HTML email body
  - `status` (text, not null default 'queued') — queued / sent / failed
  - `created_at` (timestamptz, default now())
  - `sent_at` (timestamptz, nullable) — when the email was actually sent

2. Security
- Enable RLS on `email_queue`.
- Allow anon + authenticated INSERT (edge function needs to queue emails).
- Allow anon + authenticated SELECT (to check queue status).
- No UPDATE or DELETE from the frontend.

3. Notes
- This table acts as an email outbox. The edge function inserts emails here.
- A cron job or manual process can later pick up queued emails and send them
  via an email service provider (Resend, SendGrid, etc.).
- The edge function uses the service role key which bypasses RLS.
*/

CREATE TABLE IF NOT EXISTS email_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid REFERENCES registrations(id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  recipient_name text NOT NULL,
  registration_ref text,
  subject text NOT NULL,
  body_html text NOT NULL,
  status text NOT NULL DEFAULT 'queued',
  created_at timestamptz DEFAULT now(),
  sent_at timestamptz
);

ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_email_queue" ON email_queue;
CREATE POLICY "anon_insert_email_queue"
ON email_queue FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_email_queue" ON email_queue;
CREATE POLICY "anon_select_email_queue"
ON email_queue FOR SELECT
TO anon, authenticated
USING (true);
