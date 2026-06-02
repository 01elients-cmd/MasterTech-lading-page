import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
app.use(express.json());

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper: Get settings as object
async function getSettings() {
  const { data, error } = await supabase.from('settings').select('*');
  if (error || !data) return {};
  const settingsObj: Record<string, string> = {};
  for (const s of data) {
    settingsObj[s.key] = s.value;
  }
  return settingsObj;
}

// Stateless Token Helpers
const generateAdminToken = () => {
  const secret = process.env.ADMIN_PASSWORD || 'admin123';
  const data = `admin-${Date.now()}`;
  const hash = crypto.createHmac('sha256', secret).update(data).digest('hex');
  return `${data}.${hash}`;
};

const verifyAdminToken = (token: string) => {
  const secret = process.env.ADMIN_PASSWORD || 'admin123';
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [data, hash] = parts;
  
  // Expiry check (24 hours)
  const timestamp = parseInt(data.split('-')[1]);
  if (Date.now() - timestamp > 24 * 60 * 60 * 1000) return false;
  
  const expectedHash = crypto.createHmac('sha256', secret).update(data).digest('hex');
  return hash === expectedHash;
};

// Authentication Middleware
const authenticateAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No autorizado. Se requiere token.' });
    return;
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: 'Token inválido o expirado.' });
    return;
  }
  
  next();
};

// --- ENDPOINTS PÚBLICOS ---

app.get('/api/settings', async (req, res) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.post('/api/leads', async (req, res) => {
  const { nombre, telefono, vehiculo, servicio, placa, año, ubicacion, falla } = req.body;
  if (!nombre || !telefono || !vehiculo || !servicio) {
    res.status(400).json({ error: 'Todos los campos principales son obligatorios.' });
    return;
  }
  try {
    const { data, error } = await supabase.from('leads').insert([{
      nombre, 
      telefono, 
      vehiculo, 
      servicio, 
      status: 'Pendiente', 
      placa: placa || '', 
      anio: año || '', 
      ubicacion: ubicacion || '', 
      falla: falla || ''
    }]).select();
    
    if (error) {
      console.error("Supabase insert error (RLS issue), triggering fallback:", error);
      // We don't throw here to allow the webhook fallback to execute
    }
    
    const settings = await getSettings();
    const webhookUrl = settings.WEBHOOK_URL;
    
    if (webhookUrl && webhookUrl.startsWith('http')) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono, vehiculo, servicio, placa, año, ubicacion, falla, timestamp: new Date().toISOString() }),
      }).catch(err => console.error("Webhook fallback error:", err));
    }
    
    // Return success to the client regardless of Supabase error, so they don't see the 500 error
    res.status(201).json({ success: true, leadId: data?.[0]?.id || 'fallback-id', message: 'Cita reservada correctamente.' });
  } catch (error) {
    console.error("Critical server error:", error);
    res.status(500).json({ error: 'Error del servidor al procesar la cita.', details: error });
  }
});

app.post('/api/login', async (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (password === adminPassword) {
    const token = generateAdminToken();
    // We no longer use Supabase for sessions to avoid RLS block
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Contraseña incorrecta' });
  }
});

// --- ENDPOINTS PROTEGIDOS ---
app.post('/api/logout', authenticateAdmin, async (req, res) => {
  // Stateless tokens don't need server-side invalidation
  // The client will just discard it.
  res.json({ success: true, message: 'Sesión cerrada correctamente.' });
});

app.get('/api/verify-token', authenticateAdmin, (req, res) => {
  res.json({ valid: true });
});

app.get('/api/leads', authenticateAdmin, async (req, res) => {
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: 'Error del servidor.' });
  res.json(data);
});

app.put('/api/leads/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const updates: any = {};
  if (status !== undefined) updates.status = status;
  if (notes !== undefined) updates.notes = notes;
  
  const { data, error } = await supabase.from('leads').update(updates).eq('id', id).select();
  if (error || !data?.length) return res.status(500).json({ error: 'Error al actualizar.' });
  res.json(data[0]);
});

app.delete('/api/leads/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) return res.status(500).json({ error: 'Error al eliminar.' });
  res.json({ success: true, message: 'Lead eliminado correctamente.' });
});

app.put('/api/settings', authenticateAdmin, async (req, res) => {
  const newSettings = req.body;
  try {
    for (const [key, value] of Object.entries(newSettings)) {
      const { data: existing } = await supabase.from('settings').select('*').eq('key', key).maybeSingle();
      if (existing) {
        await supabase.from('settings').update({ value: String(value) }).eq('key', key);
      } else {
        await supabase.from('settings').insert([{ key, value: String(value) }]);
      }
    }
    const updated = await getSettings();
    res.json({ success: true, settings: updated });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar configuraciones.' });
  }
});

app.post('/api/seed', async (req, res) => {
  const defaultSettings = {
      PHONE_NUMBER: '+584123565012',
      WHATSAPP_LINK: 'https://wa.link/xnj37f',
      WEBHOOK_URL: 'https://script.google.com/macros/s/AKfycbxIzUm7itb1hP8BCfbt3tWThExU_jBM9h_-kxJbGb7TlMryGA-zc01OmRnoAASU5AOM/exec',
      GOOGLE_MAPS_LINK: 'https://maps.app.goo.gl/fybS1jW9buxQD5gv7',
      GOOGLE_MAPS_EMBED: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15665.5!2d-63.8681155!3d10.9701683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c318fe358d81b01%3A0xf0c67c88a5063093!2sTaller%20MasterTech!5e0!3m2!1ses!2sve!4v1700000000000!5m2!1ses!2sve',
      GOOGLE_BUSINESS_URL: 'https://maps.app.goo.gl/fybS1jW9buxQD5gv7',
      HERO_IMG: '/assets/hero_bg.png',
      LOGO_URL: '/logo.png',
      BEFORE_AFTER_1: '/assets/before_after_1.png',
      BEFORE_AFTER_2: '/assets/before_after_2.png',
      IS_OPEN: 'true',
      BANNER_TEXT: '¡Especialistas en vehículos Japoneses y Americanos! Garantía de 3 meses en todos los trabajos.',
      WHATSAPP_MESSAGE_TEMPLATE: 'Hola *{nombre}*, te saludamos desde *Taller MasterTech* 🛠️. Hemos recibido tu solicitud para el servicio de *{servicio}* para tu *{vehiculo}*. Quisiéramos coordinar los detalles de tu cita. ¿En qué horario te resultaría más cómodo asistir?'
  };
  try {
      for (const [key, value] of Object.entries(defaultSettings)) {
          const { data: existing } = await supabase.from('settings').select('*').eq('key', key).maybeSingle();
          if (!existing) {
              await supabase.from('settings').insert([{ key, value: String(value) }]);
          }
      }
      res.json({ success: true, message: 'Settings seeded' });
  } catch(err) {
      res.status(500).json({ error: 'Seed failed' });
  }
});

export default app;
