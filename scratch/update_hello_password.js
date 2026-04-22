
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqbnokdhqoqgojhdrawd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYm5va2RocW9xZ29qaGRyYXdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQzNDE5NywiZXhwIjoyMDkyMDEwMTk3fQ.Hl1v2oxA5O_Vv-Yss3p_MNkTSo3WikXiVNO-Eteeysw';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function updatePassword() {
  const email = 'hello@urbantribe.com';
  const newPassword = '654321';

  console.log(`Searching for user: ${email}...`);

  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing users:', listError.message);
    return;
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    console.error(`User with email ${email} not found.`);
    return;
  }

  console.log(`Found user ID: ${user.id}. Updating password...`);

  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    password: newPassword
  });

  if (updateError) {
    console.error('Error updating password:', updateError.message);
  } else {
    console.log(`Password for ${email} successfully updated to ${newPassword}.`);
  }
}

updatePassword();
