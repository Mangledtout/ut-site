import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqbnokdhqoqgojhdrawd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYm5va2RocW9xZ29qaGRyYXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzQxOTcsImV4cCI6MjA5MjAxMDE5N30.QleClpvfyc4xpRj6LyBeeDUYyrKUMZZkM7L99FV7Ypc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectComments() {
  console.log('Fetching all comments...');
  const { data, error } = await supabase
    .from('comments')
    .select('*');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Total comments: ${data.length}`);
  data.forEach(c => {
    console.log(`ID: ${c.id} | Content: ${c.content}`);
  });
}

inspectComments();
