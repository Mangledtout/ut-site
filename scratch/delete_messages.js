import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqbnokdhqoqgojhdrawd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYm5va2RocW9xZ29qaGRyYXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzQxOTcsImV4cCI6MjA5MjAxMDE5N30.QleClpvfyc4xpRj6LyBeeDUYyrKUMZZkM7L99FV7Ypc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteAllPrivateMessages() {
  console.log('Fetching private messages...');
  const { data, error } = await supabase
    .from('comments')
    .select('id, content')
    .filter('content', 'ilike', '%🔒 [PRIVATE_MESSAGE]%');

  if (error) {
    console.error('Error fetching:', error);
    return;
  }

  console.log(`Found ${data.length} private messages.`);
  if (data.length === 0) return;

  const ids = data.map(m => m.id);
  console.log('Deleting...');
  const { error: delError } = await supabase
    .from('comments')
    .delete()
    .in('id', ids);

  if (delError) {
    console.error('Error deleting:', delError);
  } else {
    console.log('Successfully deleted all private messages.');
  }
}

deleteAllPrivateMessages();
