import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wywsdaktgoicdffdvxqo.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_lo2gxawnBcIyCg68r_WBOw_g-MD1fdL';

async function test() {
  const resp = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`);
  const json = await resp.json();
  if (json.definitions) {
     console.log(JSON.stringify(json.definitions.gallery, null, 2));
  } else {
     console.log(json);
  }
}
test();
