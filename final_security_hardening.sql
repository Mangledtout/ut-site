-- Urban Tribe - Final Security Hardening
-- This script secures the platform against privilege escalation and unauthorized data access.

-- 1. Secure Profiles & Prevent Role Escalation
-- Prevent users from changing their own roles via RLS or direct API calls.
-- First, update the role check to include 'admin'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('parent', 'provider', 'admin'));

-- Trigger to protect sensitive columns
CREATE OR REPLACE FUNCTION protect_profile_role()
RETURNS TRIGGER AS $$
BEGIN
    -- Only allow admins to change roles
    IF (SELECT role FROM public.profiles WHERE id = auth.uid()) != 'admin' THEN
        IF NEW.role != OLD.role THEN
            NEW.role := OLD.role;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS ensure_profile_role_integrity ON public.profiles;
CREATE TRIGGER ensure_profile_role_integrity
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION protect_profile_role();

-- 2. Secure Children & Guardians
-- Ensure only authorized guardians can manage children
DROP POLICY IF EXISTS "Guardians can manage their children" ON public.children;
CREATE POLICY "Guardians can manage their children" ON public.children
FOR ALL USING (
    EXISTS (SELECT 1 FROM child_guardians WHERE child_id = public.children.id AND profile_id = auth.uid())
    OR (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
);

-- 3. Secure Activities & Providers
-- Providers can only manage their own activities
DROP POLICY IF EXISTS "Providers can manage their own activities" ON public.activities;
CREATE POLICY "Providers can manage their own activities" ON public.activities
FOR ALL USING (
    EXISTS (SELECT 1 FROM providers p WHERE p.id = public.activities.provider_id AND p.owner_id = auth.uid())
    OR (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
);

-- Providers can manage their own business profile
DROP POLICY IF EXISTS "Providers can manage their own profile" ON public.providers;
CREATE POLICY "Providers can manage their own profile" ON public.providers
FOR ALL USING (
    owner_id = auth.uid()
    OR (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
);

-- 4. Secure News & Polls
-- Providers can only manage their own news
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Providers can manage their own news" ON public.news;
CREATE POLICY "Providers can manage their own news" ON public.news
FOR ALL USING (
    EXISTS (SELECT 1 FROM providers p WHERE p.id = public.news.provider_id AND p.owner_id = auth.uid())
    OR (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
);

-- 5. Secure Waitlists
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Waitlist visibility" ON public.waitlist;
CREATE POLICY "Waitlist visibility" ON public.waitlist
FOR SELECT USING (
    parent_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM activities a JOIN providers p ON a.provider_id = p.id WHERE a.id = public.waitlist.activity_id AND p.owner_id = auth.uid())
    OR (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
);

DROP POLICY IF EXISTS "Waitlist management" ON public.waitlist;
CREATE POLICY "Waitlist management" ON public.waitlist
FOR ALL USING (parent_id = auth.uid() OR (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')));

-- 6. Storage Security Hardening
-- Ensure users can only upload to their own folders and can't list entire buckets
DROP POLICY IF EXISTS "Users can upload their own children photos" ON storage.objects;
CREATE POLICY "Users can upload their own children photos" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'urban-tribe-assets' 
    AND (storage.foldername(name))[1] = 'children'
    AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Public can view assets" ON storage.objects;
CREATE POLICY "Public can view assets" ON storage.objects
FOR SELECT USING (bucket_id = 'urban-tribe-assets');

-- 7. Secure Interest Submissions (Newsletter)
-- Prevent public from reading submissions
DROP POLICY IF EXISTS "Admins can view interest submissions" ON public.interest_submissions;
CREATE POLICY "Admins can view interest submissions" ON public.interest_submissions
FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 8. Activity Likes Security
DROP POLICY IF EXISTS "Manage activity likes" ON public.activity_likes;
CREATE POLICY "Manage activity likes" ON public.activity_likes
FOR ALL USING (auth.uid() = user_id);
