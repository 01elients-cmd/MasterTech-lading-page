import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSessionInsert() {
  const token = crypto.randomUUID();
  const { data, error } = await supabase.from('sessions').insert([{ token }]).select();
  
  if (error) {
    console.error("Supabase Session Insert Error:", error);
  } else {
    console.log("Session Insert Success:", data);
  }
}

testSessionInsert();
