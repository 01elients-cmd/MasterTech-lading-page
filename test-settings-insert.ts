import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSettingsInsert() {
  const { data, error } = await supabase.from('settings').insert([{ key: 'TEST', value: '123' }]);
  if (error) {
    console.error("Supabase Settings Insert Error:", error);
  } else {
    console.log("Settings Insert Success:", data);
  }
}

testSettingsInsert();
