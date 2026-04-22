-- Migration: Add missing columns to activities table
ALTER TABLE activities ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS location_type TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS age_groups TEXT[];
ALTER TABLE activities ADD COLUMN IF NOT EXISTS start_time TIME;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS end_time TIME;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS event_dates DATE[];
ALTER TABLE activities ADD COLUMN IF NOT EXISTS price_child DECIMAL(10,2) DEFAULT 0;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS price_adult DECIMAL(10,2) DEFAULT 0;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS required_permissions TEXT[];
ALTER TABLE activities ADD COLUMN IF NOT EXISTS recurrence TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS capacity INTEGER;

-- Update RLS if needed
-- (Assuming RLS is already set up for activities)
