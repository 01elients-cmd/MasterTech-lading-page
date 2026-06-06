import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function countLeads() {
  const { data, error, count } = await supabase.from('leads').select('*', { count: 'exact' });
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Total leads in Supabase:", count);
    console.log("First 3 leads:", data.slice(0, 3));
  }
}

countLeads();
