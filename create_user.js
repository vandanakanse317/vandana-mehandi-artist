import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wywsdaktgoicdffdvxqo.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_lo2gxawnBcIyCg68r_WBOw_g-MD1fdL';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.auth.signUp({
    email: 'test_admin@example.com',
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
