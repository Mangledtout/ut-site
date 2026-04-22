
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqbnokdhqoqgojhdrawd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYm5va2RocW9xZ29qaGRyYXdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQzNDE5NywiZXhwIjoyMDkyMDEwMTk3fQ.Hl1v2oxA5O_Vv-Yss3p_MNkTSo3WikXiVNO-Eteeysw';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function updateHelloPassword() {
  console.log('Updating password for hello@urbantribe.com...');

  // 1. Get user
  const { data: { users }, error: fetchError } = await supabase.auth.admin.listUsers();
  if (fetchError) {
    console.error('Error fetching users:', fetchError.message);
    return;
  }

  const user = users.find(u => u.email === 'hello@urbantribe.com');

  if (!user) {
    console.log('User not found. Creating hello@urbantribe.com...');
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: 'hello@urbantribe.com',
      password: '123456',
      email_confirm: true,
      user_metadata: { role: 'parent' }
    });
    if (createError) {
      console.error('Error creating user:', createError.message);
    } else {
      console.log('User hello@urbantribe.com created successfully with password 123456.');
    }
  } else {
    console.log('User found. Updating password...');
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: '123456', email_confirm: true }
    );
    if (updateError) {
      console.error('Error updating password:', updateError.message);
    } else {
      console.log('Password for hello@urbantribe.com updated to 123456.');
    }
  }
}

updateHelloPassword();
