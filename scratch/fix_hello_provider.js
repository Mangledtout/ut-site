
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqbnokdhqoqgojhdrawd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYm5va2RocW9xZ29qaGRyYXdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQzNDE5NywiZXhwIjoyMDkyMDEwMTk3fQ.Hl1v2oxA5O_Vv-Yss3p_MNkTSo3WikXiVNO-Eteeysw';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function fixHelloProvider() {
  const helloAuthId = '01b7dc87-c3fb-44a4-8560-c82a1384085f';
  const helloEmail = 'hello@urbantribe.com';

  console.log('Fixing profile and provider for hello@urbantribe.com...');

  // 1. Update the profile for the correct Auth ID
  const { error: profError } = await supabase.from('profiles').update({
    role: 'provider',
    full_name: 'Urban Tribe',
    email: helloEmail
  }).eq('id', helloAuthId);

  if (profError) {
    console.error('Error updating profile:', profError.message);
  } else {
    console.log('Profile updated to provider role.');
  }

  // 2. Assign "Urban Tribe" provider to this ID
  const { data: utProvider } = await supabase.from('providers').select('*').eq('business_name', 'Urban Tribe').single();
  
  if (utProvider) {
    const { error: provError } = await supabase.from('providers').update({
      owner_id: helloAuthId
    }).eq('id', utProvider.id);

    if (provError) {
      console.error('Error updating provider owner:', provError.message);
    } else {
      console.log('Urban Tribe provider now owned by hello@urbantribe.com.');
    }
  }

  // 3. Clean up the orphaned profile if it exists
  await supabase.from('profiles').delete().eq('id', '0022f41b-8882-4050-97a3-009830ec47fb');

  console.log('Fix complete! Please log out and log back in as hello@urbantribe.com');
}

fixHelloProvider();
