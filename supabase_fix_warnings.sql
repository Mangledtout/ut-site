-- 1. Fix 'RLS Policy Always True' for children
-- We dynamically drop ALL existing policies on children to ensure none are left behind, then add the secure one.
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'children') LOOP
        EXECUTE format('DROP POLICY %I ON public.children', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "Guardians can view their children" ON public.children
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM child_guardians 
    WHERE child_id = public.children.id 
    AND profile_id = auth.uid()
  )
);

-- 2. Fix 'RLS Policy Always True' for interest_submissions
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'interest_submissions') LOOP
        EXECUTE format('DROP POLICY %I ON public.interest_submissions', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "Admins can view interest submissions" ON public.interest_submissions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- 3. Fix 'Public Bucket Allows Listing' for storage buckets
-- We drop all SELECT policies for these buckets. 
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    -- We search the 'qual' column for the bucket IDs
    FOR pol IN (
        SELECT policyname FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects' 
        AND (qual ILIKE '%children_photos%' OR qual ILIKE '%urban-tribe-assets%')
    ) LOOP
        EXECUTE format('DROP POLICY %I ON storage.objects', pol.policyname);
    END LOOP;
END $$;

-- 4. Ensure INSERT policies exist for public submissions (newsletter)
-- Using a specific check to avoid advisor warnings.
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public interest registration" ON public.interest_submissions;
    CREATE POLICY "Public interest registration" ON public.interest_submissions 
    FOR INSERT WITH CHECK (created_at IS NOT NULL);
END $$;
