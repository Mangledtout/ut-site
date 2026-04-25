-- Fix infinite recursion in child_guardians policy
-- The previous policy queried the same table, causing a loop.
-- We use a security definer function to break the recursion.

CREATE OR REPLACE FUNCTION check_is_guardian(target_child_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM child_guardians 
    WHERE child_id = target_child_id 
    AND profile_id = auth.uid()
  );
$$;

DROP POLICY IF EXISTS "Guardian visibility" ON public.child_guardians;

CREATE POLICY "Guardian visibility" ON public.child_guardians
FOR SELECT USING (
  profile_id = auth.uid() -- I am the guardian
  OR check_is_guardian(child_id) -- I am another guardian for same child
  OR (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) -- Admins
);

-- Re-apply Manage guardians policy just to be sure
DROP POLICY IF EXISTS "Manage guardians" ON public.child_guardians;
CREATE POLICY "Manage guardians" ON public.child_guardians
FOR ALL USING (profile_id = auth.uid() OR (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')));
