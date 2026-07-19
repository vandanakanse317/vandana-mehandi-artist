import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wywsdaktgoicdffdvxqo.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_lo2gxawnBcIyCg68r_WBOw_g-MD1fdLV';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testColumn(col) {
  const { data, error } = await supabase.from('gallery').insert([{
    category: 'test',
    image_url: 'test.jpg',
    [col]: 'test'
  }]);
  if (error && error.code === 'PGRST204') {
    return false;
  }
  return true;
}

async function test() {
  console.log("author_id:", await testColumn('author_id'));
  console.log("uid:", await testColumn('uid'));
  console.log("owner:", await testColumn('owner'));
  console.log("profile_id:", await testColumn('profile_id'));
}
test();
