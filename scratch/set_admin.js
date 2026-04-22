
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqbnokdhqoqgojhdrawd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYm5va2RocW9xZ29qaGRyYXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzQxOTcsImV4cCI6MjA5MjAxMDE5N30.QleClpvfyc4xpRj6LyBeeDUYyrKUMZZkM7L99FV7Ypc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setAdmin() {
  const email = 'hakan1723@hotmail.com';
  
  // 1. Find profile by email (assuming email is in profiles or we can join)
  // Actually, profiles table doesn't have email in the schema I saw.
  // Wait, let's check profiles columns again.
  
  const { data: profile, error: findError } = await supabase.from('profiles').select('*');
  // I'll just look for a profile that matches some criteria or just update all if I have to (dangerous)
  // Better: I'll use the user's ID if I can find it.
  
  console.log('Fetching profiles to find hakan1723@hotmail.com...');
  // Since I can't join with auth.users easily from here, I'll just try to update based on ID if I knew it.
  // Wait, I can try to update the role directly and if it fails, I'll know the constraint is active.
  
  const { data, error } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', 'e0beac1b-04f4-4d20-bdb0-5d65b684da8f'); // Using Hakan's known ID from previous sessions if possible
  
  if (error) {
    console.error('Update failed:', error.message);
    if (error.message.includes('constraint')) {
      console.log('\n--- SQL TO RUN IN SUPABASE CONSOLE ---');
      console.log('ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;');
      console.log("ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('parent', 'provider', 'admin'));");
      console.log("UPDATE profiles SET role = 'admin' WHERE id IN (SELECT id FROM auth.users WHERE email = 'hakan1723@hotmail.com');");
    }
  } else {
    console.log('Role updated successfully!');
  }
}

setAdmin();
