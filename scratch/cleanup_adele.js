
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqbnokdhqoqgojhdrawd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYm5va2RocW9xZ29qaGRyYXdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQzNDE5NywiZXhwIjoyMDkyMDEwMTk3fQ.Hl1v2oxA5O_Vv-Yss3p_MNkTSo3WikXiVNO-Eteeysw';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function cleanupAdele() {
  console.log('Cleaning up duplicate/ghost adele profiles...');

  // 1. Get all profiles named adele
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .ilike('full_name', '%adele%');

  if (error) {
    console.error('Error fetching profiles:', error.message);
    return;
  }

  console.log('Found profiles:', profiles.length);

  // 2. Identify ghost profiles (those that don't match the real email or have no email in auth)
  const { data: { users } } = await supabase.auth.admin.listUsers();
  
  for (const p of profiles) {
    const authUser = users.find(u => u.id === p.id);
    if (!authUser || authUser.email !== 'adele@mangledtout.com') {
      console.log(`Deleting ghost profile: ${p.full_name} (ID: ${p.id})`);
      
      // Delete from profiles
      const { error: delErr } = await supabase.from('profiles').delete().eq('id', p.id);
      if (delErr) console.error('Delete error:', delErr.message);
      
      // Also delete from Auth if it exists but is not the main one
      if (authUser && authUser.email !== 'adele@mangledtout.com') {
        await supabase.auth.admin.deleteUser(p.id);
        console.log('Deleted from Auth as well.');
      }
    } else {
      console.log(`Keeping main profile: ${p.full_name} (${authUser.email})`);
    }
  }

  console.log('Cleanup complete!');
}

cleanupAdele();
