const { createClient } = require('@supabase/supabase-js');
const url = process.env.VITE_SUPABASE_URL || 'https://wywsdaktgoicdffdvxqo.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);
async function test() {
  const { data, error } = await supabase.from('classes_info').select('*');
  console.log("Data:", data, "Error:", error);
}
test();
