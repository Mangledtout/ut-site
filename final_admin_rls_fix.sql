-- FINAL SECURITY HARDENING & ADMIN OVERRIDES
-- This script secures the profiles table and ensures admins have full oversight across all critical tables.

-- 1. Profiles Table Hardening
-- Remove the "Public profiles are viewable by everyone" sieve
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;

-- Users can only see their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Admins can see ALL profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admins can update ALL profiles (for role management)
CREATE POLICY "Admins can update all profiles" ON public.profiles
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 2. Comments Table - Admin Full CRUD
-- The previous audit only gave SELECT to admins. This adds DELETE and UPDATE.
DROP POLICY IF EXISTS "Admins can manage all comments" ON public.comments;
CREATE POLICY "Admins can manage all comments" ON public.comments
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3. Invoices/Bookings - Admin Full CRUD
DROP POLICY IF EXISTS "Admins can manage all invoices" ON public.invoices;
CREATE POLICY "Admins can manage all invoices" ON public.invoices
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Activities - Admin Full CRUD
DROP POLICY IF EXISTS "Admins can manage all activities" ON public.activities;
CREATE POLICY "Admins can manage all activities" ON public.activities
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 5. Providers - Admin Full CRUD
DROP POLICY IF EXISTS "Admins can manage all providers" ON public.providers;
CREATE POLICY "Admins can manage all providers" ON public.providers
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 6. News & Polls - Admin Full CRUD
DROP POLICY IF EXISTS "Admins can manage all news" ON public.news;
CREATE POLICY "Admins can manage all news" ON public.news
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 7. Social Connections (Parent Connections) - Admin Oversight
-- Admins should be able to see all connections for community moderation
DROP POLICY IF EXISTS "Admins can view all connections" ON public.parent_connections;
CREATE POLICY "Admins can view all connections" ON public.parent_connections
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 8. Waitlist - Admin Oversight
DROP POLICY IF EXISTS "Admins can view all waitlist entries" ON public.waitlist;
CREATE POLICY "Admins can view all waitlist entries" ON public.waitlist
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 9. Newsletter/Interest Submissions - Admin Oversight (Ensure it exists)
DROP POLICY IF EXISTS "Admins can view interest submissions" ON public.interest_submissions;
CREATE POLICY "Admins can view interest submissions" ON public.interest_submissions
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 10. Provider Permissions
DROP POLICY IF EXISTS "Admins can manage all provider permissions" ON public.provider_permissions;
CREATE POLICY "Admins can manage all provider permissions" ON public.provider_permissions
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
