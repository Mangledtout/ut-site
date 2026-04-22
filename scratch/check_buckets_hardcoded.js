import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://dqbnokdhqoqgojhdrawd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYm5va2RocW9xZ29qaGRyYXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzQxOTcsImV4cCI6MjA5MjAxMDE5N30.QleClpvfyc4xpRj6LyBeeDUYyrKUMZZkM7L99FV7Ypc');

async function check() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}
check();
