
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://dqbnokdhqoqgojhdrawd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYm5va2RocW9xZ29qaGRyYXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzQxOTcsImV4cCI6MjA5MjAxMDE5N30.QleClpvfyc4xpRj6LyBeeDUYyrKUMZZkM7L99FV7Ypc');

async function swapAdminRoles() {
  console.log('Swapping roles...');

  // 1. Set hakan1723@hotmail.com to parent
  const { error: error1 } = await supabase
    .from('profiles')
    .update({ role: 'parent' })
    .eq('email', 'hakan1723@hotmail.com');

  if (error1) {
    console.error('Error updating hakan:', error1);
  } else {
    console.log('hakan1723@hotmail.com is now a Parent.');
  }

  // 2. Set adele@mangledtout.com to admin
  const { error: error2 } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('email', 'adele@mangledtout.com');

  if (error2) {
    console.error('Error updating adele:', error2);
  } else {
    console.log('adele@mangledtout.com is now an Admin.');
  }
}

swapAdminRoles();
