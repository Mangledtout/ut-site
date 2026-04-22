
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqbnokdhqoqgojhdrawd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYm5va2RocW9xZ29qaGRyYXdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQzNDE5NywiZXhwIjoyMDkyMDEwMTk3fQ.Hl1v2oxA5O_Vv-Yss3p_MNkTSo3WikXiVNO-Eteeysw';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createStorageBucket() {
  console.log('Attempting to create storage bucket: urban-tribe-assets...');
  
  const { data, error } = await supabase.storage.createBucket('urban-tribe-assets', {
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    fileSizeLimit: 5242880 // 5MB
  });

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('Bucket "urban-tribe-assets" already exists.');
    } else {
      console.error('Error creating bucket:', error.message);
    }
  } else {
    console.log('Bucket "urban-tribe-assets" created successfully.');
  }
}

createStorageBucket();
