import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wywsdaktgoicdffdvxqo.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.warn('VITE_SUPABASE_ANON_KEY is missing. Please add it in your environment variables settings.');
}

export const supabase = createClient(
  supabaseUrl, 
  supabaseKey || 'placeholder_anon_key'
);

