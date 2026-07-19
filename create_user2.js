import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://wywsdaktgoicdffdvxqo.supabase.co', 'sb_publishable_lo2gxawnBcIyCg68r_WBOw_g-MD1fdL');
async function test() {
  const { data, error } = await supabase.auth.signUp({
    email: 'test' + Date.now() + '@gmail.com',
    password: 'password123'
  });
  console.log("SignUp:", error ? error.message : "Success");
  if (!error) {
    const { error: insertError } = await supabase.from('gallery').insert([{
      category: 'Signature Mehndi Collection',
      image_url: 'test.jpg'
    }]);
    console.log("Insert:", insertError ? insertError.message : "Success");
  }
}
test();
