const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('gallery').select('*').limit(3);
  console.log(data);
  const buckets = await supabase.storage.getBuckets();
  console.log(buckets.data);
}
run();
