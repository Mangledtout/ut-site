-- Urban Tribe: Email Verification Migration
-- This migration adds a verification flag to profiles and keeps it in sync with auth.users

-- 1. Add is_verified column to profiles if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- 2. Sync existing users' verification status from auth.users
UPDATE public.profiles p
SET is_verified = (u.email_confirmed_at IS NOT NULL)
FROM auth.users u
WHERE p.id = u.id;

-- 3. Create or update the function to handle profile syncing
-- This handles both new users and updates to email confirmation status
CREATE OR REPLACE FUNCTION public.handle_auth_user_sync()
RETURNS TRIGGER AS $$
BEGIN
    -- If user is newly created or email confirmation status changed
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.profiles (id, email, is_verified, role)
        VALUES (NEW.id, NEW.email, (NEW.email_confirmed_at IS NOT NULL), 'parent')
        ON CONFLICT (id) DO UPDATE
        SET is_verified = (NEW.email_confirmed_at IS NOT NULL);
    ELSIF (TG_OP = 'UPDATE') THEN
        UPDATE public.profiles
        SET is_verified = (NEW.email_confirmed_at IS NOT NULL)
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Recreate the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_sync ON auth.users;
CREATE TRIGGER on_auth_user_sync
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_sync();

-- 5. Add a comment for documentation
COMMENT ON COLUMN public.profiles.is_verified IS 'Synced with auth.users.email_confirmed_at to enforce verified access';
