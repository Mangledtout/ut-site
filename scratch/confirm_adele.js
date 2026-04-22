
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqbnokdhqoqgojhdrawd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYm5va2RocW9xZ29qaGRyYXdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQzNDE5NywiZXhwIjoyMDkyMDEwMTk3fQ.Hl1v2oxA5O_Vv-Yss3p_MNkTSo3WikXiVNO-Eteeysw';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function confirmAdele() {
  console.log('Using Service Role Key to confirm Adele...');

  // 1. Get user by email
  const { data: { users }, error: fetchError } = await supabase.auth.admin.listUsers();
  
  if (fetchError) {
    console.error('Error listing users:', fetchError.message);
    return;
  }

  const adele = users.find(u => u.email === 'adele@mangledtout.com');

  if (!adele) {
    console.error('User adele@mangledtout.com not found in Auth!');
    return;
  }

  console.log('Found Adele with ID:', adele.id);

  // 2. Update user (confirm email and set password)
  const { error: updateError } = await supabase.auth.admin.updateUserById(
    adele.id,
    { 
      email_confirm: true, 
      password: '123456',
      user_metadata: { role: 'admin' }
    }
  );

  if (updateError) {
    console.error('Error confirming user:', updateError.message);
  } else {
    console.log('Adele account confirmed and password set to 123456 successfully!');
    
    // 3. Ensure profiles table is also updated
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', adele.id);

    if (profileError) {
      console.error('Error updating profile role:', profileError.message);
    } else {
      console.log('Profile role confirmed as Admin.');
    }
  }
}

confirmAdele();
