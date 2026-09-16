CREATE UNIQUE INDEX IF NOT EXISTS registrations_payment_transaction_id_unique
ON public.registrations (payment_transaction_id)
WHERE payment_transaction_id IS NOT NULL;
