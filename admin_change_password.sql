-- SQL to add admin password change capability
-- Run this in your Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION admin_change_password(target_user_id UUID, new_password TEXT)
RETURNS VOID AS $$
BEGIN
  -- 1. Security Check: Only admins can call this
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can change passwords.';
  END IF;

  -- 2. Update the encrypted_password in auth.users
  -- Note: Supabase uses bcrypt (bf) for password hashing
  UPDATE auth.users
  SET encrypted_password = crypt(new_password, gen_salt('bf'))
  WHERE id = target_user_id;

  -- 3. Update metadata to reflect the change
  UPDATE auth.users
  SET updated_at = now()
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
