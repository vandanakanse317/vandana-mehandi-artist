import { supabase } from './src/lib/supabase.ts';
async function test() {
  const { data, error } = await supabase.storage.getBuckets();
  console.log(data);
}
test();
