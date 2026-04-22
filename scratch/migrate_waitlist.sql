-- Step 1: Add max_children column to activities table
ALTER TABLE activities ADD COLUMN IF NOT EXISTS max_children integer DEFAULT NULL;

-- Step 2: Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid REFERENCES activities(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  event_date date NOT NULL,
  position integer NOT NULL,
  status text DEFAULT 'waiting',
  created_at timestamptz DEFAULT now()
);

-- Step 3: Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Parents can see and manage their own waitlist entries
CREATE POLICY "Parents manage own waitlist" ON waitlist
  FOR ALL USING (auth.uid() = parent_id);

-- Providers can read waitlist entries for their activities
CREATE POLICY "Providers read their activity waitlists" ON waitlist
  FOR SELECT USING (
    activity_id IN (
      SELECT a.id FROM activities a
      JOIN providers p ON p.id = a.provider_id
      WHERE p.owner_id = auth.uid()
    )
  );

-- Admins have full access
CREATE POLICY "Admins full access to waitlist" ON waitlist
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
