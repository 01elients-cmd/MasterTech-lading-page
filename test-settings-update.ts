import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSettingsUpdate() {
  const { data, error } = await supabase.from('settings').update({ value: 'true' }).eq('key', 'IS_OPEN').select();
  if (error) {
    console.error("Settings Update Error:", error);
  } else {
    console.log("Settings Update Success:", data);
  }
}

testSettingsUpdate();
