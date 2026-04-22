import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://dqbnokdhqoqgojhdrawd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYm5va2RocW9xZ29qaGRyYXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzQxOTcsImV4cCI6MjA5MjAxMDE5N30.QleClpvfyc4xpRj6LyBeeDUYyrKUMZZkM7L99FV7Ypc');

async function deleteSpecific() {
  await supabase.auth.signInWithPassword({
    email: 'adele@mangledtout.com',
    password: '123456'
  });

  const ids = ['2aea7bf1-2b37-40fc-aca1-a50ee7d438b1', '589701dd-9ceb-45f5-87bd-cb0364a52087', 'da837590-896f-494f-b791-6b23846fd733', '8bdd3320-402f-4ce8-85d3-47851045f99e'];
  console.log('Deleting specific IDs...');
  const { error } = await supabase.from('comments').delete().in('id', ids);
  
  if (error) console.error('Error:', error);
  else console.log('Specific IDs deleted successfully.');
  
  const { count } = await supabase.from('comments').select('*', { count: 'exact', head: true });
  console.log('Final count:', count);
}

deleteSpecific();
