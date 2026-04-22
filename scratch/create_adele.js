
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://dqbnokdhqoqgojhdrawd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYm5va2RocW9xZ29qaGRyYXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzQxOTcsImV4cCI6MjA5MjAxMDE5N30.QleClpvfyc4xpRj6LyBeeDUYyrKUMZZkM7L99FV7Ypc');

async function createAdeleAdmin() {
  console.log('Attempting to create adele@mangledtout.com...');

  // 1. Sign up
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: 'adele@mangledtout.com',
    password: '123456',
    options: {
      data: {
        role: 'admin' // Some triggers use this
      }
    }
  });

  if (signUpError) {
    if (signUpError.message.includes('already registered')) {
      console.log('User already exists. Cannot change password without Service Role Key.');
    } else {
      console.error('Sign up error:', signUpError.message);
    }
  } else {
    console.log('User signed up successfully!');
    
    // 2. Ensure profile is Admin
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', signUpData.user.id);

    if (updateError) {
      console.error('Failed to set role to admin:', updateError.message);
    } else {
      console.log('Role set to Admin successfully.');
    }
  }
}

createAdeleAdmin();
