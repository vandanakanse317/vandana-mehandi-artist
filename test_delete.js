import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wywsdaktgoicdffdvxqo.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_lo2gxawnBcIyCg68r_WBOw_g-MD1fdLV';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  await supabase.auth.signInWithPassword({ email: 'admin@example.com', password: 'password' }).catch(e => {}); // dummy login just to see
  const { error } = await supabase.from('gallery').delete().eq('id', 'd9b0488f-1234-4a4b-88a2-1234567890ab');
  console.log("Delete error:", error);
}
test();
