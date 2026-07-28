import express from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' })); // Reduced from 50mb — no legitimate use case needs more
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// =============================================================
// SECURITY HEADERS MIDDLEWARE (Helmet-equivalent, zero deps)
// =============================================================
app.use((_req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Force HTTPS via HSTS (1 year)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  // Disable browser features not needed
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  // Referrer control
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'", // Required for React hydration
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://*.supabase.co https://api.telegram.org https://script.google.com",
      "frame-src https://www.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );
  // Remove server fingerprinting
  res.removeHeader('X-Powered-By');
  next();
});

// =============================================================
// CORS — Restrict to known origins in production
// =============================================================
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://mastertech-taller.vercel.app',
    'https://mastertech.com.ve',
    'http://localhost:3000',
    'http://localhost:5173',
  ];
  const origin = req.headers.origin || '';
  if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24h preflight cache
  }
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

// =============================================================
// RATE LIMITER — In-memory sliding window, zero deps
// =============================================================
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) rateLimitStore.delete(key);
  }
}, 10 * 60 * 1000);

function createRateLimiter(maxRequests: number, windowMs: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
    const key = `${ip}:${req.path}`;
    const now = Date.now();

    const entry = rateLimitStore.get(key);
    if (!entry || now > entry.resetAt) {
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (entry.count >= maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.status(429).json({
        error: 'Demasiadas solicitudes. Intenta de nuevo en unos minutos.',
        retryAfter,
      });
      return;
    }

    entry.count++;
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - entry.count);
    next();
  };
}

// Limits: stricter for auth, more lenient for public endpoints
const strictLimit = createRateLimiter(5, 15 * 60 * 1000);   // 5 req / 15 min (login)
const standardLimit = createRateLimiter(20, 15 * 60 * 1000); // 20 req / 15 min (leads form)
const relaxedLimit = createRateLimiter(100, 15 * 60 * 1000); // 100 req / 15 min (read)

// =============================================================
// INPUT SANITIZATION HELPERS
// =============================================================
function sanitizeString(input: unknown, maxLength = 500): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, maxLength)
    // Remove HTML tags to prevent XSS stored in DB
    .replace(/<[^>]*>/g, '')
    // Remove null bytes
    .replace(/\0/g, '');
}

function sanitizePhone(phone: unknown): string {
  if (typeof phone !== 'string') return '';
  // Only allow digits, spaces, +, -, (, )
  return phone.trim().replace(/[^\d\s+\-()+]/g, '').slice(0, 20);
}


// Helper: Get settings as object
async function getSettings() {
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
      IMG_INSTALACIONES: '/assets/instalaciones.jpg',
      IMG_SRV_MECANICA: '/assets/servicio-mecanica.jpg',
      IMG_SRV_MANTENIMIENTO: '/24214142.png',
      IMG_SRV_ELECTRICIDAD: '/assets/servicio-electricidad.jpg',
      IMG_SRV_FRENOS: '/assets/servicio-frenos.jpg',
      IMG_SRV_INYECCION: '/assets/servicio-inyeccion.jpg',
      IMG_SRV_CLIMATIZACION: '/assets/servicio-climatizacion.jpg',
      IMG_SRV_LAVADO: '/assets/hero_bg.png',
      IS_OPEN: 'true',
      BANNER_TEXT: '¡Especialistas en vehículos Japoneses y Americanos! Garantía de 3 meses en todos los trabajos.',
      WHATSAPP_MESSAGE_TEMPLATE: 'Hola *{nombre}*, te saludamos desde *Taller MasterTech* 🛠️. Hemos recibido tu solicitud para el servicio de *{servicio}* para tu *{vehiculo}*. Quisiéramos coordinar los detalles de tu cita. ¿En qué horario te resultaría más cómodo asistir?',
      SUCCESS_BADGE: '¡TIENES UN 30% DE DESCUENTO!',
      SUCCESS_TEXT: 'Un técnico especialista se comunicará contigo vía WhatsApp en breve para coordinar tu descuento y cita.',
      
      // Textos de Servicios
      DESC_SRV_MECANICA: 'Reparación profunda de motores, sustitución de embragues y solución de fallas mecánicas complejas con repuestos de alta calidad.',
      DESC_SRV_MANTENIMIENTO: 'Cambios de aceite sintético, reemplazo de filtros y fluidos esenciales para alargar la vida útil de tu motor.',
      DESC_SRV_ELECTRICIDAD: 'Diagnóstico computarizado, reparación de alternadores, arranques y corrección de cableado y módulos electrónicos.',
      DESC_SRV_FRENOS: 'Cambio de pastillas, rectificación de discos, reemplazo de amortiguadores y ajuste completo de tren delantero.',
      DESC_SRV_INYECCION: 'Limpieza ultrasónica de inyectores, diagnóstico de bombas de gasolina y optimización del consumo de combustible.',
      DESC_SRV_CLIMATIZACION: 'Carga de gas refrigerante, detección de fugas y mantenimiento completo del sistema de aire acondicionado.',
      DESC_SRV_LAVADO: 'Lavado detallado de carrocería, limpieza profunda de motor e interior para entregar tu vehículo impecable.',

      // Equipo (JSON Array)
      TEAM_MEMBERS_JSON: JSON.stringify([
        { id: 1, name: 'Jesús M.', role: 'Jefe de Mecánica', desc: 'Experto en diagnóstico avanzado y reparación de motores con más de 15 años de experiencia multimarca.', img: '/jesus.jpg' },
        { id: 2, name: 'Miguel A.', role: 'Especialista en Electrónica', desc: 'Ingeniero automotriz dedicado a la resolución de fallas eléctricas complejas y reprogramación de módulos.', img: '/assets/hero_bg.png' },
        { id: 3, name: 'Ana P.', role: 'Asesora de Servicio', desc: 'Encargada de la recepción, atención personalizada y seguimiento continuo del estatus de tu vehículo.', img: '/assets/instalaciones.jpg' }
      ]),

      // Reseñas (JSON Array)
      REVIEWS_JSON: JSON.stringify([
        { id: 1, name: 'Carlos R.', car: 'Honda Civic 2018', quote: 'Llevé mi carro por una falla eléctrica que nadie encontraba y aquí dieron con el problema el mismo día. Excelente servicio y muy transparentes.' },
        { id: 2, name: 'María V.', car: 'Toyota Corolla 2020', quote: 'Muy honestos con los precios y el diagnóstico. Me mostraron las piezas desgastadas antes de cambiarlas. Me dieron mucha confianza.' },
        { id: 3, name: 'José L.', car: 'Jeep Grand Cherokee', quote: 'Tienen equipos de primera. El mantenimiento quedó impecable, resolvieron un ruido en el tren delantero y me entregaron el carro lavado.' }
      ]),

      // Marcas (JSON Array)
      BRANDS_JSON: JSON.stringify([
        "Jeep", "Toyota", "Honda", "Dodge", "Nissan", "Chrysler", "Lexus"
      ])
  };

  const { data, error } = await supabase.from('settings').select('*');
  if (error || !data || data.length === 0) return defaultSettings;
  
  const settingsObj: Record<string, string> = { ...defaultSettings };
  for (const s of data) {
    if (s.value) settingsObj[s.key] = s.value;
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

// Handler reutilizable para GET /settings
const handleGetSettings = async (req: express.Request, res: express.Response) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// Handler reutilizable para POST /leads
const handlePostLeads = async (req: express.Request, res: express.Response) => {
  // Sanitize all inputs before processing
  const nombre = sanitizeString(req.body.nombre, 100);
  const telefono = sanitizePhone(req.body.telefono);
  const vehiculo = sanitizeString(req.body.vehiculo, 100);
  const servicio = sanitizeString(req.body.servicio, 100);
  const placa = sanitizeString(req.body.placa, 20);
  const año = sanitizeString(req.body.año || req.body.anio, 20);
  const ubicacion = sanitizeString(req.body.ubicacion, 200);
  const falla = sanitizeString(
    req.body.falla || 
    req.body.descripcion || 
    (req.body.fecha_hora ? `Fecha preferida de inspección: ${req.body.fecha_hora}` : ''), 
    500
  );

  if (!nombre || !telefono || !vehiculo || !servicio) {
    res.status(400).json({ error: 'Todos los campos principales son obligatorios.' });
    return;
  }

  // Basic phone validation
  if (telefono.replace(/\D/g, '').length < 7) {
    res.status(400).json({ error: 'Número de teléfono inválido.' });
    return;
  }

    try {
      const { data, error } = await supabase.from('leads').insert([{
        nombre, telefono, vehiculo, servicio,
        status: 'Pendiente',
        placa,
        anio: año,
        ubicacion,
        falla
      }]).select();
      if (error) console.error("Supabase insert error (RLS issue), triggering fallback:", error);

      const settings = await getSettings();
      const webhookUrl = settings.WEBHOOK_URL;
      
      const promises: Promise<any>[] = [];

      if (webhookUrl && webhookUrl.startsWith('https://')) {
        promises.push(
          fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, telefono, vehiculo, servicio, placa, año, ubicacion, falla, timestamp: new Date().toISOString() }),
          }).catch(err => console.error("Webhook fallback error:", err))
        );
      }

      // Notificación a Telegram (Grupo y Tópico)
      const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
      const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
      const topicId = process.env.TELEGRAM_TOPIC_ID?.trim();

      if (botToken && chatId) {
        const telegramMessage = [
          '🛎️ *NUEVA CITA REGISTRADA* 🛎️',
          '',
          `👤 *Nombre:* ${nombre}`,
          `📞 *Teléfono:* ${telefono}`,
          `🚗 *Vehículo:* ${vehiculo}`,
          `🔧 *Servicio:* ${servicio}`,
          placa ? `🏷️ *Placa:* ${placa}` : '',
          año ? `📅 *Año:* ${año}` : '',
          ubicacion ? `📍 *Ubicación:* ${ubicacion}` : '',
          falla ? `⚠️ *Falla:* ${falla}` : '',
          '',
          '*Status:* Pendiente'
        ].filter(Boolean).join('\n');

        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const tgBody: Record<string, unknown> = {
          chat_id: chatId,
          text: telegramMessage,
          parse_mode: 'Markdown'
        };
        if (topicId) tgBody.message_thread_id = topicId;

        promises.push(
          fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tgBody)
          }).catch(err => console.error("Telegram notification error:", err))
        );
      }

      // Wait for all external requests to finish before responding
      // so serverless environments don't kill the process early.
      let debugTg = "not-sent";
      if (promises.length > 0) {
        const results = await Promise.allSettled(promises);
        debugTg = results.map(r => r.status).join(',');
      }

      res.status(201).json({ 
        success: true, 
        leadId: data?.[0]?.id || 'fallback-id', 
        message: 'Cita reservada correctamente.',
        debug: {
          botToken: botToken ? botToken.substring(0, 5) + '...' : 'missing',
          chatId: chatId ? chatId : 'missing',
          topicId: topicId ? topicId : 'missing',
          tgResult: debugTg
        }
      });
    } catch (error) {
      console.error("Critical server error:", error);
      res.status(500).json({ error: 'Error del servidor al procesar la cita.' });
    }
};

// Handler reutilizable para POST /login
const handlePostLogin = async (req: express.Request, res: express.Response) => {
  const password = sanitizeString(req.body.password, 200);
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  // Timing-safe comparison to prevent timing attacks
  const inputBuf = Buffer.from(password.padEnd(adminPassword.length));
  const expectedBuf = Buffer.from(adminPassword);
  const passwordMatch = inputBuf.length === expectedBuf.length &&
    crypto.timingSafeEqual(inputBuf, expectedBuf);

  if (passwordMatch) {
    const token = generateAdminToken();
    res.json({ token });
  } else {
    // Add a small delay to further slow down brute force
    await new Promise(r => setTimeout(r, 500));
    res.status(401).json({ error: 'Contraseña incorrecta' });
  }
};

// Handler reutilizable para GET /leads
const handleGetLeads = async (req: express.Request, res: express.Response) => {
  try {
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error("Error al consultar citas desde Supabase:", error);
      return res.status(500).json({ error: 'Error al consultar la base de datos de citas.', details: error.message });
    }
    res.json(data || []);
  } catch (err: any) {
    console.error("Excepción en GET /leads:", err);
    res.status(500).json({ error: 'Error del servidor.' });
  }
};

// Handler reutilizable para PUT /leads/:id
const handlePutLead = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  // Validate ID is a number to prevent SQL injection
  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: 'ID inválido.' });
    return;
  }
  const validStatuses = ['Pendiente', 'Contactado', 'En Diagnóstico', 'Completado', 'Cancelado'];
  const status = req.body.status && validStatuses.includes(req.body.status) ? req.body.status : undefined;
  const notes = req.body.notes !== undefined ? sanitizeString(req.body.notes, 2000) : undefined;
  const updates: Record<string, string> = {};
  if (status !== undefined) updates.status = status;
  if (notes !== undefined) updates.notes = notes;
  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: 'No hay campos válidos para actualizar.' });
    return;
  }
  const { data, error } = await supabase.from('leads').update(updates).eq('id', Number(id)).select();
  if (error || !data?.length) return res.status(500).json({ error: 'Error al actualizar.' });
  res.json(data[0]);
};

// Handler reutilizable para DELETE /leads/:id
const handleDeleteLead = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) return res.status(500).json({ error: 'Error al eliminar.' });
  res.json({ success: true, message: 'Lead eliminado correctamente.' });
};

// Handler reutilizable para PUT /settings
const handlePutSettings = async (req: express.Request, res: express.Response) => {
  const newSettings = req.body;
  try {
    const upsertData = Object.entries(newSettings).map(([key, value]) => ({
      key,
      value: value === null || value === undefined ? '' : String(value)
    }));

    if (upsertData.length > 0) {
      const { error } = await supabase.from('settings').upsert(upsertData, { onConflict: 'key' });
      if (error) {
        console.error("Error doing bulk upsert:", error);
        throw error;
      }
    }

    const updated = await getSettings();
    res.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Error saving settings:", error);
    res.status(500).json({ error: 'Error al guardar configuraciones.', details: error });
  }
};

// Registrar rutas con Y SIN prefijo /api para compatibilidad con Vercel rewrites
// En Vercel el req.url puede llegar como /api/settings o como /settings según el contexto

// Public read (relaxed limit)
app.get('/api/settings', relaxedLimit, handleGetSettings);
app.get('/settings', relaxedLimit, handleGetSettings);

// Lead submission (standard limit to prevent spam)
app.post('/api/leads', standardLimit, handlePostLeads);
app.post('/leads', standardLimit, handlePostLeads);

// Login (strict limit — brute force protection)
app.post('/api/login', strictLimit, handlePostLogin);
app.post('/login', strictLimit, handlePostLogin);

app.post('/api/logout', authenticateAdmin, async (_req, res) => {
  res.json({ success: true, message: 'Sesión cerrada correctamente.' });
});
app.post('/logout', authenticateAdmin, async (_req, res) => {
  res.json({ success: true, message: 'Sesión cerrada correctamente.' });
});

app.get('/api/verify-token', relaxedLimit, authenticateAdmin, (_req, res) => {
  res.json({ valid: true });
});
app.get('/verify-token', relaxedLimit, authenticateAdmin, (_req, res) => {
  res.json({ valid: true });
});

app.get('/api/leads', relaxedLimit, authenticateAdmin, handleGetLeads);
app.get('/leads', relaxedLimit, authenticateAdmin, handleGetLeads);

app.put('/api/leads/:id', relaxedLimit, authenticateAdmin, handlePutLead);
app.put('/leads/:id', relaxedLimit, authenticateAdmin, handlePutLead);

app.delete('/api/leads/:id', strictLimit, authenticateAdmin, handleDeleteLead);
app.delete('/leads/:id', strictLimit, authenticateAdmin, handleDeleteLead);

app.put('/api/settings', relaxedLimit, authenticateAdmin, handlePutSettings);
app.put('/settings', relaxedLimit, authenticateAdmin, handlePutSettings);

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
      IMG_INSTALACIONES: '/assets/instalaciones.jpg',
      IMG_SRV_MECANICA: '/assets/servicio-mecanica.jpg',
      IMG_SRV_MANTENIMIENTO: '/24214142.png',
      IMG_SRV_ELECTRICIDAD: '/assets/servicio-electricidad.jpg',
      IMG_SRV_FRENOS: '/assets/servicio-frenos.jpg',
      IMG_SRV_INYECCION: '/assets/servicio-inyeccion.jpg',
      IMG_SRV_CLIMATIZACION: '/assets/servicio-climatizacion.jpg',
      IMG_SRV_LAVADO: '/assets/hero_bg.png',
      IS_OPEN: 'true',
      BANNER_TEXT: '¡Especialistas en vehículos Japoneses y Americanos! Garantía de 3 meses en todos los trabajos.',
      WHATSAPP_MESSAGE_TEMPLATE: 'Hola *{nombre}*, te saludamos desde *Taller MasterTech* 🛠️. Hemos recibido tu solicitud para el servicio de *{servicio}* para tu *{vehiculo}*. Quisiéramos coordinar los detalles de tu cita. ¿En qué horario te resultaría más cómodo asistir?',
      SUCCESS_BADGE: '¡TIENES UN 30% DE DESCUENTO!',
      SUCCESS_TEXT: 'Un técnico especialista se comunicará contigo vía WhatsApp en breve para coordinar tu descuento y cita.'
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

// Vercel serverless handler (default export)
export default function handler(req: IncomingMessage, res: ServerResponse) {
  return app(req, res);
}

// Named export for local dev server (server.ts)
export { app };

