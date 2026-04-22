import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://dqbnokdhqoqgojhdrawd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYm5va2RocW9xZ29qaGRyYXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzQxOTcsImV4cCI6MjA5MjAxMDE5N30.QleClpvfyc4xpRj6LyBeeDUYyrKUMZZkM7L99FV7Ypc');

async function setup() {
  console.log('Creating bucket...');
  const { data, error } = await supabase.storage.createBucket('urban-tribe-assets', {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/*']
  });
  if (error) console.error('Error creating bucket:', error);
  else console.log('Bucket created successfully:', data);
}
setup();
