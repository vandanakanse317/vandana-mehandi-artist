import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://wywsdaktgoicdffdvxqo.supabase.co', 'sb_publishable_lo2gxawnBcIyCg68r_WBOw_g-MD1fdL');
async function test() {
  await supabase.auth.signUp({ email: 'test' + Date.now() + 'b@gmail.com', password: 'password123' });
  const { error } = await supabase.from('gallery').insert([{
    category: 'signature-mehandi',
    image_url: 'test.jpg'
  }]);
  console.log("Insert with bucket name:", error ? error.message : "Success");
}
test();
