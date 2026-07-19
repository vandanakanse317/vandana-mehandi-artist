import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wywsdaktgoicdffdvxqo.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_lo2gxawnBcIyCg68r_WBOw_g-MD1fdLV';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test(col) {
  const { data, error } = await supabase.from('gallery').select(col).limit(1);
  if (error) console.log(col, "MISSING");
  else console.log(col, "EXISTS");
}

async function run() {
  await test('id');
  await test('created_at');
  await test('category');
  await test('image_url');
  await test('title');
}
run();
