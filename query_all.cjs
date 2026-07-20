const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: gallery } = await supabase.from('gallery').select('*').like('image_url', '%1784452781698%');
  console.log('gallery:', gallery);
  
  const { data: settings } = await supabase.from('settings').select('*');
  console.log('settings hero:', settings[0]?.heroHeading, settings[0]?.profileCoverUrl);
}
run();
