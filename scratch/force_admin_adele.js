
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqbnokdhqoqgojhdrawd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYm5va2RocW9xZ29qaGRyYXdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQzNDE5NywiZXhwIjoyMDkyMDEwMTk3fQ.Hl1v2oxA5O_Vv-Yss3p_MNkTSo3WikXiVNO-Eteeysw';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function forceAdmin() {
  console.log('Force setting Adele as Admin...');

  const { data: { users } } = await supabase.auth.admin.listUsers();
  const adele = users.find(u => u.email === 'adele@mangledtout.com');

  if (!adele) {
    console.error('Adele not found!');
    return;
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', adele.id);

  if (error) {
    console.error('Error updating role:', error.message);
  } else {
    console.log('Adele is now officially an ADMIN in the profiles table.');
  }
}

forceAdmin();
