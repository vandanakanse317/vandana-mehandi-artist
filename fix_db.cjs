const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => {
  const [k, v] = line.split('=');
  if(k && v) acc[k] = v.trim();
  return acc;
}, {});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.storage.getBucket('flower-decoration');
  if (error) {
    console.log("Bucket doesn't exist. Creating...");
    // Since anon key usually can't create buckets unless RLS allows it (which it doesn't), this will fail.
    const { data: createData, error: createErr } = await supabase.storage.createBucket('flower-decoration', { public: true });
    console.log("Create result:", createData, createErr);
  } else {
    console.log("Bucket exists:", data);
  }
}
test();
