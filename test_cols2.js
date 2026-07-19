import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://wywsdaktgoicdffdvxqo.supabase.co', 'sb_publishable_lo2gxawnBcIyCg68r_WBOw_g-MD1fdL');
async function testColumn(col) {
  const { error } = await supabase.from('gallery').insert([{ category: 'test', [col]: 'uuid' }]);
  return error?.code === 'PGRST204' ? false : true;
}
async function test() {
  const cols = ['created_by', 'account_id', 'admin', 'role'];
  for (const c of cols) console.log(c, await testColumn(c));
}
test();
