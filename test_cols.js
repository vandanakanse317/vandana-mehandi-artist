import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wywsdaktgoicdffdvxqo.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_lo2gxawnBcIyCg68r_WBOw_g-MD1fdL';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testColumn(col) {
  const { data, error } = await supabase.from('gallery').insert([{
    category: 'test',
    image_url: 'test.jpg',
    [col]: 'd9b0488f-1234-4a4b-88a2-1234567890ab'
  }]);
  if (error && error.code === 'PGRST204') return false;
  return true;
}

async function test() {
  const cols = ['userId', 'creator_id', 'admin_id', 'user_id'];
  for (const col of cols) {
    console.log(col, await testColumn(col));
  }
}
test();
