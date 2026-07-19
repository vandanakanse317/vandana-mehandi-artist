import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://wywsdaktgoicdffdvxqo.supabase.co', 'sb_publishable_lo2gxawnBcIyCg68r_WBOw_g-MD1fdL');
async function test() {
  await supabase.auth.signUp({ email: 'test' + Date.now() + 'e@gmail.com', password: 'password123' });
  const { error } = await supabase.storage.from('signature-mehandi').upload('Signature Mehndi Collection/test.jpg', 'hello');
  console.log("Upload:", error ? error.message : "Success");
}
test();
