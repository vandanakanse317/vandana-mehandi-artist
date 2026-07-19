import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wywsdaktgoicdffdvxqo.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_lo2gxawnBcIyCg68r_WBOw_g-MD1fdL';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: 'nileshjagtap9689@gmail.com', // wait, I don't know the password
    password: 'password'
  });
  console.log("SignIn Error:", signInError);
}
test();
