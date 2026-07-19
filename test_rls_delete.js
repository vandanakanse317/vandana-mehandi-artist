import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wywsdaktgoicdffdvxqo.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_lo2gxawnBcIyCg68r_WBOw_g-MD1fdLV';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { error: authErr } = await supabase.auth.signInWithPassword({ email: 'admin@example.com', password: 'password' });
  console.log("Auth err:", authErr ? authErr.message : "Success");
  
  const { data, error } = await supabase.from('gallery').select('*').limit(1);
  if (data && data.length > 0) {
    const { data: delData, error: delErr } = await supabase.from('gallery').delete().eq('id', data[0].id).select();
    console.log("Delete error:", delErr);
    console.log("Deleted data:", delData);
  }
}
test();
