import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wywsdaktgoicdffdvxqo.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_lo2gxawnBcIyCg68r_WBOw_g-MD1fdLV';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { error: authErr } = await supabase.auth.signInWithPassword({ email: 'admin@example.com', password: 'password' });
  if (authErr) console.log("Auth error:", authErr.message);

  const { data, error } = await supabase.from('gallery').select('*').limit(1);
  if (data && data.length > 0) {
    const img = data[0];
    const category = img.category;
    const bucket = category === 'Signature Mehndi Collection' ? 'signature-mehandi' : category === 'Flower Decoration' ? 'flower-decoration' : 'mehandi-classes';
    
    console.log("Found image:", img);

    const { error: storageError } = await supabase.storage.from(bucket).remove([img.image_url]);
    console.log("Storage delete error:", storageError ? storageError.message : "Success");

    const { error: dbError } = await supabase.from('gallery').delete().eq('id', img.id);
    console.log("DB delete error:", dbError ? dbError.message : "Success");
  } else {
    console.log("No images found to delete.");
  }
}
test();
