-- Migration: Prepare for Stripe Integration

-- 1. Ensure invoices table has parent_id and stripe_session_id
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- 2. Update status constraint to include 'pending' if needed, 
-- or ensure it supports 'paid' and 'unpaid'
-- First, drop the old constraint if it exists (Supabase might have named it automatically)
DO $$ 
BEGIN
    ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_status_check;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

ALTER TABLE invoices ADD CONSTRAINT invoices_status_check CHECK (status IN ('paid', 'unpaid', 'split', 'pending'));

-- 3. Add index on stripe_session_id for faster webhook lookups
CREATE INDEX IF NOT EXISTS idx_invoices_stripe_session_id ON invoices(stripe_session_id);
