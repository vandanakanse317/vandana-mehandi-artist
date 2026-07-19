import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://wywsdaktgoicdffdvxqo.supabase.co', 'sb_publishable_lo2gxawnBcIyCg68r_WBOw_g-MD1fdL');
async function test() {
  await supabase.auth.signUp({ email: 'test' + Date.now() + 'a@gmail.com', password: 'password123' });
  
  const { error } = await supabase.from('gallery').insert([{
    category: 'Signature Mehndi Collection',
    image_url: 'Signature Mehndi Collection/test.jpg'
  }]);
  console.log("Insert with category in URL:", error ? error.message : "Success");
}
test();
