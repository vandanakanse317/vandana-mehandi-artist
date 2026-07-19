import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wywsdaktgoicdffdvxqo.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_lo2gxawnBcIyCg68r_WBOw_g-MD1fdLV';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('gallery').insert([{
    category: 'test',
    image_url: 'test.jpg'
  }]);
  console.log("Error:", error);
}
test();
