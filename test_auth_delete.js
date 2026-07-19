import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://wywsdaktgoicdffdvxqo.supabase.co', process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data: authData, error: authErr } = await supabase.auth.signUp({ email: 'test_delete' + Date.now() + '@gmail.com', password: 'password123' });
  console.log("Auth err:", authErr ? authErr.message : "Success");
  
  // Insert
  const { data: insertData, error: insertError } = await supabase.from('gallery').insert([{
    category: 'Signature Mehndi Collection',
    image_url: 'test_delete.jpg'
  }]).select();
  
  console.log("Insert:", insertError ? insertError.message : "Success", insertData);
  
  if (insertData && insertData.length > 0) {
    const { error: delError } = await supabase.from('gallery').delete().eq('id', insertData[0].id);
    console.log("Delete:", delError ? delError.message : "Success");
  }
}
test();
