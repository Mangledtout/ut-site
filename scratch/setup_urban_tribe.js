
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqbnokdhqoqgojhdrawd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYm5va2RocW9xZ29qaGRyYXdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQzNDE5NywiZXhwIjoyMDkyMDEwMTk3fQ.Hl1v2oxA5O_Vv-Yss3p_MNkTSo3WikXiVNO-Eteeysw';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupUrbanTribe() {
  console.log('Setting up Urban Tribe as the only business...');

  // 1. Get Adele's ID
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error('Auth error:', authError.message);
    return;
  }
  const adele = users.find(u => u.email === 'adele@mangledtout.com');
  if (!adele) {
    console.error('Adele not found!');
    return;
  }
  const adeleId = adele.id;
  console.log('Adele ID:', adeleId);

  // 2. Ensure Adele is an Admin in profiles
  await supabase.from('profiles').update({ role: 'admin' }).eq('id', adeleId);

  // 3. Find or Create Urban Tribe Provider
  const { data: existingProviders } = await supabase.from('providers').select('*');
  let urbanTribe = existingProviders.find(p => p.business_name === 'Urban Tribe');

  if (!urbanTribe) {
    console.log('Creating Urban Tribe provider...');
    const { data: newProvider, error: createError } = await supabase
      .from('providers')
      .insert({
        owner_id: adeleId,
        business_name: 'Urban Tribe',
        description: 'The primary activity hub for the urban community.'
      })
      .select()
      .single();
    
    if (createError) {
      console.error('Error creating Urban Tribe:', createError.message);
      return;
    }
    urbanTribe = newProvider;
  } else {
    console.log('Updating Urban Tribe provider to be owned by Adele...');
    const { data: updated, error: updateError } = await supabase
      .from('providers')
      .update({ owner_id: adeleId })
      .eq('id', urbanTribe.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating Urban Tribe:', updateError.message);
      return;
    }
    urbanTribe = updated;
  }

  // 4. Move all activities to Urban Tribe
  console.log('Moving all activities to Urban Tribe...');
  const { error: actError } = await supabase
    .from('activities')
    .update({ provider_id: urbanTribe.id })
    .neq('provider_id', urbanTribe.id);
    
  if (actError) {
    console.error('Error moving activities:', actError.message);
  }

  // 5. Delete all other providers
  console.log('Deleting other providers...');
  const { error: deleteError } = await supabase
    .from('providers')
    .delete()
    .neq('id', urbanTribe.id);

  if (deleteError) {
    console.error('Error deleting other providers:', deleteError.message);
  } else {
    console.log('Other providers deleted successfully.');
  }

  console.log('Setup complete! Adele owns Urban Tribe, and it is the only provider.');
}

setupUrbanTribe();
