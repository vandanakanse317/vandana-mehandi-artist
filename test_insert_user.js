import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wywsdaktgoicdffdvxqo.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_lo2gxawnBcIyCg68r_WBOw_g-MD1fdLV';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('gallery').insert([{
    category: 'test',
    image_url: 'test.jpg',
    user_id: 'd9b0488f-1234-4a4b-88a2-1234567890ab'
  }]);
  console.log("Error:", error);
}
test();
