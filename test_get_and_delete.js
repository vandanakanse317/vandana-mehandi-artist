import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://wywsdaktgoicdffdvxqo.supabase.co', process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('gallery').select('*').limit(1);
  console.log("Data:", data);
  if (data && data.length > 0) {
     const { error: delErr } = await supabase.from('gallery').delete().eq('id', data[0].id);
     console.log("Delete error:", delErr);
     // verify if deleted
     const { data: data2 } = await supabase.from('gallery').select('*').eq('id', data[0].id);
     console.log("Still there?", data2);
  }
}
test();
