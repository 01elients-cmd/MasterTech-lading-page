import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const { data, error } = await supabase.from('leads').insert([{
    nombre: 'Test', 
    telefono: '123', 
    vehiculo: 'Test', 
    servicio: 'Línea de inspección gratuita', 
    status: 'Pendiente', 
    placa: '123', 
    anio: '2024', 
    ubicacion: 'Test', 
    falla: 'Test'
  }]).select();
  
  if (error) {
    console.error("Supabase Error:", error);
  } else {
    console.log("Success:", data);
  }
}

testInsert();
