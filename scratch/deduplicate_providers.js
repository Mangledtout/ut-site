
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqbnokdhqoqgojhdrawd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYm5va2RocW9xZ29qaGRyYXdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQzNDE5NywiZXhwIjoyMDkyMDEwMTk3fQ.Hl1v2oxA5O_Vv-Yss3p_MNkTSo3WikXiVNO-Eteeysw';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function deduplicateProviders() {
  console.log('Deduplicating providers...');

  // 1. Fetch all providers
  const { data: providers, error } = await supabase.from('providers').select('*');
  if (error) {
    console.error('Error fetching providers:', error.message);
    return;
  }

  console.log('Total providers found:', providers.length);

  // 2. Identify duplicates (same name and owner)
  const seen = new Set();
  const toDelete = [];

  for (const p of providers) {
    const key = `${p.business_name}_${p.owner_id}`;
    if (seen.has(key)) {
      toDelete.push(p.id);
    } else {
      seen.add(key);
    }
  }

  console.log('Identifying', toDelete.length, 'duplicates to delete.');

  if (toDelete.length === 0) {
    console.log('No duplicates found.');
    return;
  }

  // 3. Delete duplicates
  // We should do this in batches if there are many, but 28 is small.
  const { error: delError } = await supabase.from('providers').delete().in('id', toDelete);
  
  if (delError) {
    console.error('Error deleting duplicates:', delError.message);
  } else {
    console.log('Successfully deleted', toDelete.length, 'duplicate provider records.');
  }
}

deduplicateProviders();
