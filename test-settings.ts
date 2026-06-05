import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSelectSettings() {
  const { data, error } = await supabase.from('settings').select('*');
  if (error) {
    console.error("Supabase Settings Error:", error);
  } else {
    console.log("Settings Success:", data);
  }
}

testSelectSettings();
