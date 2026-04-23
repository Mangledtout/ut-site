-- Comprehensive Fix for Supabase Security Advisor errors
-- This script enables Row Level Security (RLS) on all public tables and adds basic policies.

-- 1. Enable RLS on all tables mentioned by the advisor and found in the codebase
ALTER TABLE IF EXISTS public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.child_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.enrollments ENABLE ROW LEVEL SECURITY;

-- Additional tables found in codebase
ALTER TABLE IF EXISTS public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.waiting_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.parent_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.activity_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.news_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.interest_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.provider_permissions ENABLE ROW LEVEL SECURITY;

-- 2. Add missing policies for tables that need them to function
-- (The advisor says policies already exist for activities, child_guardians, children, profiles, providers)

-- For Invoices: Allow users to view their own invoices
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'invoices') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'invoices' AND policyname = 'Users can view their own invoices') THEN
            CREATE POLICY "Users can view their own invoices" ON public.invoices FOR SELECT USING (auth.uid() = parent_id);
        END IF;
    END IF;
END $$;

-- For Enrollments: Allow users to view their own enrollments (if table exists and has owner column)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'enrollments') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'enrollments' AND policyname = 'Users can view their own enrollments') THEN
            -- Only create policy if parent_id exists, otherwise just enable RLS
            IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'enrollments' AND column_name = 'parent_id') THEN
                CREATE POLICY "Users can view their own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = parent_id);
            ELSE
                -- If no parent_id, we just enable RLS (done above) to satisfy the advisor. 
                -- We can add a more general policy if needed later.
                RAISE NOTICE 'Table enrollments exists but parent_id column missing. Skipping specific policy.';
            END IF;
        END IF;
    END IF;
END $$;

-- 3. Public Read Policies for content tables (to ensure app doesn't break)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'news' AND policyname = 'Public news are viewable by everyone') THEN
        CREATE POLICY "Public news are viewable by everyone" ON public.news FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activities' AND policyname = 'Public activities are viewable by everyone') THEN
        CREATE POLICY "Public activities are viewable by everyone" ON public.activities FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'providers' AND policyname = 'Public providers are viewable by everyone') THEN
        CREATE POLICY "Public providers are viewable by everyone" ON public.providers FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Approved comments are viewable by everyone') THEN
        CREATE POLICY "Approved comments are viewable by everyone" ON public.comments FOR SELECT USING (status = 'approved');
    END IF;
END $$;
