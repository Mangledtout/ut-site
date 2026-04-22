import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqbnokdhqoqgojhdrawd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYm5va2RocW9xZ29qaGRyYXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzQxOTcsImV4cCI6MjA5MjAxMDE5N30.QleClpvfyc4xpRj6LyBeeDUYyrKUMZZkM7L99FV7Ypc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function purgeComments() {
  console.log('Purging ALL comments...');
  const { data, error } = await supabase
    .from('comments')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything

  if (error) {
    console.error('Error purging:', error);
  } else {
    console.log('Successfully purged the entire comments table.');
  }
}

purgeComments();
