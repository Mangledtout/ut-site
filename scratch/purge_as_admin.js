import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://dqbnokdhqoqgojhdrawd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYm5va2RocW9xZ29qaGRyYXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzQxOTcsImV4cCI6MjA5MjAxMDE5N30.QleClpvfyc4xpRj6LyBeeDUYyrKUMZZkM7L99FV7Ypc');

async function purgeAsAdmin() {
  console.log('Logging in as Adele...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'adele@mangledtout.com',
    password: '123456'
  });

  if (authError) {
    console.error('Login failed:', authError.message);
    return;
  }
  console.log('Logged in successfully');

  console.log('Purging messages...');
  const { error } = await supabase.from('comments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (error) console.error('Error purging:', error);
  else console.log('All messages deleted successfully as Admin.');
}

purgeAsAdmin();
