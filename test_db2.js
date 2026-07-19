import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://wywsdaktgoicdffdvxqo.supabase.co', 'sb_publishable_lo2gxawnBcIyCg68r_WBOw_g-MD1fdLV');
async function test() {
  const { error } = await supabase.from('gallery').select('user_id').limit(1);
  console.log("Error selecting user_id:", error?.message);
}
test();
