-- Security Audit Fixes for Urban Tribe
-- This script addresses identified security gaps in RLS and data privacy.

-- 1. Fix Comments Privacy (Private Messages)
-- Currently filtered in JS, which is insecure. This RLS policy ensures privacy at the DB level.
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'comments') LOOP
        EXECUTE format('DROP POLICY %I ON public.comments', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "Comments visibility" ON public.comments
FOR SELECT USING (
  (status = 'approved' AND NOT content LIKE '🔒 [PRIVATE_MESSAGE]%') -- Public approved comments
  OR (user_id = auth.uid()) -- My own comments
  OR (content LIKE '%🔒 [FOR: ' || auth.uid() || ']%') -- Private messages sent TO me
  OR (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) -- Admins see everything
  OR (EXISTS ( -- Providers see messages in their own activities/news
      SELECT 1 FROM activities a JOIN providers p ON a.provider_id = p.id WHERE a.id = public.comments.activity_id AND p.owner_id = auth.uid()
      UNION
      SELECT 1 FROM news n JOIN providers p ON n.provider_id = p.id WHERE n.id = public.comments.news_id AND p.owner_id = auth.uid()
  ))
);

CREATE POLICY "Users can add comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage their own comments" ON public.comments FOR ALL USING (auth.uid() = user_id);

-- 2. Enhanced Invoice/Booking Visibility
-- Both the parent (payer) and the provider (recipient) should see the invoice.
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'invoices') LOOP
        EXECUTE format('DROP POLICY %I ON public.invoices', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "Invoice visibility" ON public.invoices
FOR SELECT USING (
  auth.uid() = parent_id -- The parent who booked
  OR EXISTS ( -- The provider who owns the activity
    SELECT 1 FROM activities a
    JOIN providers p ON a.provider_id = p.id
    WHERE a.id = public.invoices.activity_id
    AND p.owner_id = auth.uid()
  )
  OR (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) -- Admins
);

-- 3. Parent Connections Privacy
ALTER TABLE public.parent_connections ENABLE ROW LEVEL SECURITY;
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'parent_connections') LOOP
        EXECUTE format('DROP POLICY %I ON public.parent_connections', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "Connections visibility" ON public.parent_connections
FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = receiver_id OR (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')));

CREATE POLICY "Manage connections" ON public.parent_connections
FOR ALL USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- 4. Social Likes Protection
ALTER TABLE public.activity_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_likes ENABLE ROW LEVEL SECURITY;

DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'activity_likes') LOOP
        EXECUTE format('DROP POLICY %I ON public.activity_likes', pol.policyname);
    END LOOP;
    FOR pol IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'news_likes') LOOP
        EXECUTE format('DROP POLICY %I ON public.news_likes', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "Likes visibility" ON public.activity_likes FOR SELECT USING (true);
CREATE POLICY "Manage activity likes" ON public.activity_likes FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "News likes visibility" ON public.news_likes FOR SELECT USING (true);
CREATE POLICY "Manage news likes" ON public.news_likes FOR ALL USING (auth.uid() = user_id);

-- 5. Provider Permissions
ALTER TABLE public.provider_permissions ENABLE ROW LEVEL SECURITY;
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'provider_permissions') LOOP
        EXECUTE format('DROP POLICY %I ON public.provider_permissions', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "Permissions visibility" ON public.provider_permissions
FOR SELECT USING (
  EXISTS (SELECT 1 FROM providers p WHERE p.id = public.provider_permissions.provider_id AND p.owner_id = auth.uid())
  OR (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
);

CREATE POLICY "Manage permissions" ON public.provider_permissions
FOR ALL USING (EXISTS (SELECT 1 FROM providers p WHERE p.id = public.provider_permissions.provider_id AND p.owner_id = auth.uid()));

-- 6. Child Guardians Protection
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'child_guardians') LOOP
        EXECUTE format('DROP POLICY %I ON public.child_guardians', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "Guardian visibility" ON public.child_guardians
FOR SELECT USING (
  profile_id = auth.uid() -- I am the guardian
  OR EXISTS (SELECT 1 FROM child_guardians cg WHERE cg.child_id = public.child_guardians.child_id AND cg.profile_id = auth.uid()) -- I am another guardian for same child
  OR (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) -- Admins
);

CREATE POLICY "Manage guardians" ON public.child_guardians
FOR ALL USING (profile_id = auth.uid() OR (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')));
