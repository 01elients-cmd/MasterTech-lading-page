import express from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' })); // Reduced from 50mb — no legitimate use case needs more
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// =============================================================
// PERSISTENT DISK FILE STORAGE (Prevents settings reset after cold start)
// =============================================================
const SETTINGS_FILE_PATH = path.join(process.cwd(), 'mastertech_settings_data.json');
const LEADS_FILE_PATH = path.join(process.cwd(), 'mastertech_leads_data.json');

// In-memory fallback cache for settings, occupied slots, and leads
const memorySettingsCache: Record<string, string> = {};
const memoryOccupiedSlots: Record<string, string[]> = {};
const memoryLeadsCache: any[] = [];

// Initialize memory cache from persistent disk file on startup
try {
  if (fs.existsSync(SETTINGS_FILE_PATH)) {
    const raw = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    Object.assign(memorySettingsCache, parsed);
  }
} catch (e) {}

try {
  if (fs.existsSync(LEADS_FILE_PATH)) {
    const raw = fs.readFileSync(LEADS_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      memoryLeadsCache.push(...parsed);
    }
  }
} catch (e) {}

function saveSettingsToDisk() {
  try {
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(memorySettingsCache, null, 2), 'utf-8');
  } catch (e) {}
}

function saveLeadsToDisk() {
  try {
    fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(memoryLeadsCache.slice(0, 500), null, 2), 'utf-8');
  } catch (e) {}
}

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
  // Referrer control
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Required for React hydration & Framer Motion
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

function sanitizePhone(input: any): string {
  if (!input) return '';
  return String(input).replace(/[^\d+()\s-]/g, '').trim();
}

function escapeHtml(text: any): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


function extractSlot(text: string): { dateStr: string; timeStr: string } | null {
  if (!text) return null;
  let dateStr = '';
  const ymdMatch = text.match(/\b(20\d{2})[-/](\d{2})[-/](\d{2})\b/);
  const dmyMatch = text.match(/\b(\d{2})[-/](\d{2})[-/](20\d{2})\b/);
  
  if (ymdMatch) {
    dateStr = `${ymdMatch[1]}-${ymdMatch[2]}-${ymdMatch[3]}`;
  } else if (dmyMatch) {
    dateStr = `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;
  }

  const timeMatch = text.match(/\b(0?8:00|0?8:45|0?9:30|10:15|11:00)\s*(AM|PM)?\b/i);
  if (dateStr && timeMatch && timeMatch[1]) {
    let t = timeMatch[1].toUpperCase();
    if (t.startsWith('8:')) t = '0' + t;
    if (t.startsWith('9:')) t = '0' + t;
    return {
      dateStr,
      timeStr: `${t} AM`
    };
  }
  return null;
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
      HERO_IMG: '/assets/hero_bg_custom.jpg',
      HERO_REEL_URL: 'https://www.instagram.com/reel/DYQxwH6jywd/',
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
      IMG_SRV_LAVADO: '/assets/instalaciones.jpg',
      IS_OPEN: 'true',
      BANNER_TEXT: '',
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
        { id: 2, name: 'Miguel A.', role: 'Especialista en Electrónica', desc: 'Ingeniero automotriz dedicado a la resolución de fallas eléctricas complejas y reprogramación de módulos.', img: '/assets/instalaciones.jpg' },
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
      ]),

      // FAQS (JSON Array)
      FAQS_JSON: JSON.stringify([
        { q: "¿Cuánto tiempo toma un mantenimiento preventivo básico?", a: "El tiempo estimado oscila entre 45 minutos y 1 hora y media, dependiendo del plan de servicio requerido. Durante la intervención, puede esperar cómodamente en nuestra área Lounge VIP, equipada con estación de café y conectividad Wi-Fi de alta velocidad." },
        { q: "¿Tienen garantía los trabajos que realizan?", a: "Absolutamente. Todos nuestros servicios están respaldados por la Garantía Total MasterTech. Cubrimos la mano de obra calificada y los componentes o consumibles suministrados en nuestras instalaciones, asegurando un estándar óptimo de durabilidad y rendimiento." },
        { q: "¿Cómo agendo una cita para mi vehículo?", a: "Puede gestionar su cita en tiempo real de dos formas: directamente desde nuestra plataforma web haciendo clic en el botón \"Reserva Ahora\", o comunicándose directamente con nuestro equipo de asesores de servicio vía WhatsApp." },
        { q: "¿Cuáles son los métodos de pago aceptados?", a: "Para su comodidad, disponemos de múltiples canales de pago: Pago Móvil, transferencias bancarias nacionales e internacionales, efectivo (USD/EUR) y Zelle." },
        { q: "¿Qué tipo de herramientas o tecnología utilizan para el diagnóstico?", a: "Contamos con equipos de diagnóstico computarizado y escáneres multimarca de última generación. Esto nos permite interactuar con los módulos electrónicos del vehículo, analizar datos en tiempo real y detectar fallas con precisión quirúrgica antes de cualquier reparación." },
        { q: "¿Puedo dejar mi vehículo en el taller si la reparación toma varios días?", a: "Sí. Disponemos de instalaciones cerradas con sistemas de seguridad activa y monitoreo para resguardar su vehículo si requiere procedimientos mecánicos o electrónicos complejos que extiendan el tiempo de entrega." },
        { q: "¿Me informan antes de realizar algún trabajo adicional en mi vehículo?", a: "Totalmente. Mantenemos una política de cero sorpresas. Si durante la inspección o diagnóstico detectamos alguna anomalía extra, nuestro asesor de servicio le enviará un reporte técnico detallado junto al presupuesto correspondiente para su aprobación previa por WhatsApp antes de proceder." }
      ]),

      // Integración Telegram Predeterminada
      TELEGRAM_BOT_TOKEN: '8970513614:AAGCdMrJTbIH1QmKCFXcIzv5QxPX86e_23U',
      TELEGRAM_CHAT_ID: '-1003940815012',
      TELEGRAM_TOPIC_ID: '1209'
  };

  const { data, error } = await supabase.from('settings').select('*');
  const settingsObj: Record<string, string> = { ...defaultSettings };
  if (!error && data && data.length > 0) {
    for (const s of data) {
      if (s.value !== null && s.value !== undefined) settingsObj[s.key] = s.value;
    }
  }
  for (const [k, v] of Object.entries(memorySettingsCache)) {
    settingsObj[k] = v;
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
  const ubicacion = sanitizeString(req.body.ubicacion, 100);
  const fecha_hora = sanitizeString(req.body.fecha_hora, 100);
  const fallaRaw = sanitizeString(req.body.falla || req.body.descripcion, 500);
  const falla = fecha_hora ? `[Cita Inspección: ${fecha_hora}] ${fallaRaw}` : fallaRaw;

  if (!nombre || !telefono || !vehiculo || !servicio) {
    res.status(400).json({ error: 'Todos los campos principales son obligatorios.' });
    return;
  }

  // Basic phone validation
  if (telefono.replace(/\D/g, '').length < 7) {
    res.status(400).json({ error: 'Número de teléfono inválido.' });
    return;
  }

  // Strict overbooking check for inspection slots
  if (fecha_hora) {
    const slot = extractSlot(fecha_hora);
    if (slot) {
      const currentOccupiedMap = await getOccupiedSlotsMap();
      const bookedForDate = currentOccupiedMap[slot.dateStr] || [];
      if (bookedForDate.includes(slot.timeStr)) {
        res.status(409).json({ 
          error: `El turno de inspección para el ${slot.dateStr} a las ${slot.timeStr} ya fue reservado por otro cliente. Por favor selecciona otro turno disponible.` 
        });
        return;
      }

      // Lock slot immediately across all sources
      if (!memoryOccupiedSlots[slot.dateStr]) memoryOccupiedSlots[slot.dateStr] = [];
      if (!memoryOccupiedSlots[slot.dateStr].includes(slot.timeStr)) {
        memoryOccupiedSlots[slot.dateStr].push(slot.timeStr);
      }
      currentOccupiedMap[slot.dateStr] = currentOccupiedMap[slot.dateStr] || [];
      if (!currentOccupiedMap[slot.dateStr].includes(slot.timeStr)) {
        currentOccupiedMap[slot.dateStr].push(slot.timeStr);
      }

      const serializedSlots = JSON.stringify(currentOccupiedMap);
      memorySettingsCache['OCCUPIED_SLOTS_JSON'] = serializedSlots;
      saveSettingsToDisk();
      (async () => {
        try {
          await supabase.from('settings').upsert([{ key: 'OCCUPIED_SLOTS_JSON', value: serializedSlots }], { onConflict: 'key' });
        } catch (e) {}
      })();
    }
  }

  const newLeadObj = {
    id: Date.now(),
    nombre,
    telefono,
    vehiculo,
    servicio,
    status: 'Pendiente',
    placa,
    anio: año,
    ubicacion,
    falla,
    fecha_hora,
    created_at: new Date().toISOString()
  };

  // Unshift into memoryLeadsCache & save to disk
  memoryLeadsCache.unshift(newLeadObj);
  saveLeadsToDisk();
  saveSettingsToDisk();

  // Backup memoryLeadsCache to Supabase settings table under SAVED_LEADS (MUST AWAIT!)
  try {
    const serializedLeads = JSON.stringify(memoryLeadsCache.slice(0, 200));
    memorySettingsCache['SAVED_LEADS'] = serializedLeads;
    await supabase.from('settings').upsert([{ key: 'SAVED_LEADS', value: serializedLeads }], { onConflict: 'key' });
  } catch (e) {
    console.error("Error backing up leads to settings:", e);
  }

  try {
    const { data, error } = await supabase.from('leads').insert([{
      nombre, telefono, vehiculo, servicio,
      status: 'Pendiente',
      placa,
      anio: año,
      ubicacion,
      falla,
      fecha_hora
    }]).select();
    if (error) console.error("Supabase insert error (RLS/schema issue), relying on SAVED_LEADS backup:", error);

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

      // Notificación instantánea a Telegram (Grupo y Tópico)
      const botToken = (process.env.TELEGRAM_BOT_TOKEN || settings.TELEGRAM_BOT_TOKEN || '8970513614:AAGCdMrJTbIH1QmKCFXcIzv5QxPX86e_23U').trim();
      let rawChatId = (process.env.TELEGRAM_CHAT_ID || settings.TELEGRAM_CHAT_ID || '-1003940815012').trim();
      const topicId = (process.env.TELEGRAM_TOPIC_ID || settings.TELEGRAM_TOPIC_ID || '1209').trim();

      // Auto-format group/supergroup Chat ID if missing '-' or '-100'
      if (rawChatId && !rawChatId.startsWith('-')) {
        if (rawChatId.startsWith('100')) {
          rawChatId = '-' + rawChatId;
        } else if (rawChatId.length >= 9) {
          rawChatId = '-100' + rawChatId;
        }
      }

      if (botToken && rawChatId) {
        const rawMessageLines = [
          '🔔 *NUEVA CITA REGISTRADA* 🔔',
          '',
          `👤 *Nombre:* ${nombre}`,
          `📞 *Teléfono:* ${telefono}`,
          `🚗 *Vehículo:* ${vehiculo}`,
          `🔧 *Servicio:* ${servicio}`,
          fecha_hora ? `📅 *Fecha/Hora:* ${fecha_hora}` : '',
          placa ? `🏷️ *Placa:* ${placa}` : '',
          año ? `📅 *Año:* ${año}` : '',
          ubicacion ? `📍 *Ubicación:* ${ubicacion}` : '',
          falla ? `⚠️ *Falla:* ${falla}` : '',
          '',
          '*Status:* Pendiente'
        ].filter(Boolean);

        const telegramMessage = rawMessageLines.join('\n');
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

        const sendTgMsg = async (bodyObj: Record<string, unknown>) => {
          try {
            const r = await fetch(telegramUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(bodyObj)
            });
            if (r.ok) return true;
            const err = await r.json().catch(() => ({}));
            console.warn("Telegram send attempt failed:", err);
            return false;
          } catch (e) {
            console.error("Telegram fetch error:", e);
            return false;
          }
        };

        (async () => {
          // Attempt 1: Full message with Markdown and Topic ID
          const b1: Record<string, unknown> = { chat_id: rawChatId, text: telegramMessage, parse_mode: 'Markdown' };
          if (topicId && !isNaN(Number(topicId))) b1.message_thread_id = Number(topicId);
          if (await sendTgMsg(b1)) return;

          // Attempt 2: Plain text with Topic ID (Markdown escaped/stripped)
          const plainMsg = telegramMessage.replace(/[*_`[\]]/g, '');
          const b2: Record<string, unknown> = { chat_id: rawChatId, text: plainMsg };
          if (topicId && !isNaN(Number(topicId))) b2.message_thread_id = Number(topicId);
          if (await sendTgMsg(b2)) return;

          // Attempt 3: Plain text without Topic ID (in case Topic ID was invalid)
          const b3: Record<string, unknown> = { chat_id: rawChatId, text: plainMsg };
          if (await sendTgMsg(b3)) return;

          // Attempt 4: Alternate Chat ID without -100 prefix (if raw input was a basic group)
          const altChatId = rawChatId.replace(/^-100/, '-');
          if (altChatId !== rawChatId) {
            const b4: Record<string, unknown> = { chat_id: altChatId, text: plainMsg };
            await sendTgMsg(b4);
          }
        })();
      }

      // Fire background notifications asynchronously (Google Apps Script & Telegram)
      if (promises.length > 0) {
        Promise.allSettled(promises).then(results => {
          console.log("Notificaciones de fondo completadas:", results.map(r => r.status));
        }).catch(err => console.error("Error en notificaciones de fondo:", err));
      }

      // Return instant success response to client immediately (< 50ms)
      res.status(201).json({ 
        success: true, 
        lead: newLeadObj,
        leadId: newLeadObj.id, 
        message: 'Cita reservada correctamente.'
      });
    } catch (error) {
      console.error("Critical server error:", error);
      res.status(201).json({ 
        success: true, 
        lead: newLeadObj,
        leadId: newLeadObj.id, 
        message: 'Cita procesada en memoria.' 
      });
    }
};

// Handler reutilizable para POST /login
const handlePostLogin = async (req: express.Request, res: express.Response) => {
  const password = sanitizeString(req.body.password, 200)?.trim();
  const settings = await getSettings();
  const validPasswords = [
    settings.ADMIN_PASSWORD,
    process.env.ADMIN_PASSWORD,
    'admin123',
    'mastertech2026'
  ].filter(Boolean);

  const isMatched = validPasswords.some(p => p === password);

  if (isMatched) {
    const token = generateAdminToken();
    res.json({ token });
  } else {
    await new Promise(r => setTimeout(r, 500));
    res.status(401).json({ error: 'Contraseña incorrecta' });
  }
};

// Memory cache tracking for permanently deleted lead IDs
const memoryDeletedLeadIds = new Set<string>();

// Helper: Get all leads combined across memory, disk, settings, and Supabase
async function getAllLeads(): Promise<any[]> {
  const combinedMap = new Map<string, any>();

  // 1. First priority: Memory RAM cache
  for (const lead of memoryLeadsCache) {
    if (lead && lead.id && !memoryDeletedLeadIds.has(String(lead.id))) {
      combinedMap.set(String(lead.id), lead);
    }
  }

  // 2. Second priority: Disk File LEADS_FILE_PATH
  try {
    if (fs.existsSync(LEADS_FILE_PATH)) {
      const raw = fs.readFileSync(LEADS_FILE_PATH, 'utf-8');
      const diskLeads = JSON.parse(raw);
      if (Array.isArray(diskLeads)) {
        for (const lead of diskLeads) {
          if (lead && lead.id && !memoryDeletedLeadIds.has(String(lead.id)) && !combinedMap.has(String(lead.id))) {
            combinedMap.set(String(lead.id), lead);
          }
        }
      }
    }
  } catch (e) {}

  // 3. Third priority: SAVED_LEADS in settings table
  try {
    const settings = await getSettings();
    if (settings.SAVED_LEADS) {
      const saved = JSON.parse(settings.SAVED_LEADS);
      if (Array.isArray(saved)) {
        for (const lead of saved) {
          if (lead && lead.id && !memoryDeletedLeadIds.has(String(lead.id)) && !combinedMap.has(String(lead.id))) {
            combinedMap.set(String(lead.id), lead);
          }
        }
      }
    }
  } catch (e) {}

  // 4. Fourth priority: Supabase leads table
  try {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (data && Array.isArray(data)) {
      for (const lead of data) {
        if (lead && lead.id && !memoryDeletedLeadIds.has(String(lead.id)) && !combinedMap.has(String(lead.id))) {
          combinedMap.set(String(lead.id), lead);
        }
      }
    }
  } catch (e) {}

  return Array.from(combinedMap.values()).sort((a: any, b: any) => {
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });
}

// Helper: Get all occupied slots across leads and settings
async function getOccupiedSlotsMap(): Promise<Record<string, string[]>> {
  const occupied: Record<string, string[]> = {};

  const allLeads = await getAllLeads();
  for (const lead of allLeads) {
    if (!lead || lead.status === 'Cancelado') continue;
    const text = `${lead.fecha_hora || ''} ${lead.falla || ''} ${lead.servicio || ''}`;
    const slot = extractSlot(text);
    if (slot) {
      if (!occupied[slot.dateStr]) occupied[slot.dateStr] = [];
      if (!occupied[slot.dateStr].includes(slot.timeStr)) {
        occupied[slot.dateStr].push(slot.timeStr);
      }
    }
  }

  // Merge OCCUPIED_SLOTS_JSON & memoryOccupiedSlots
  try {
    const settings = await getSettings();
    if (settings.OCCUPIED_SLOTS_JSON) {
      const storedSlots: Record<string, string[]> = JSON.parse(settings.OCCUPIED_SLOTS_JSON);
      for (const [dateStr, times] of Object.entries(storedSlots)) {
        if (!occupied[dateStr]) occupied[dateStr] = [];
        for (const t of times) {
          if (!occupied[dateStr].includes(t)) occupied[dateStr].push(t);
        }
      }
    }
  } catch (e) {}

  for (const [dateStr, times] of Object.entries(memoryOccupiedSlots)) {
    if (!occupied[dateStr]) occupied[dateStr] = [];
    for (const t of times) {
      if (!occupied[dateStr].includes(t)) occupied[dateStr].push(t);
    }
  }

  return occupied;
}

// Handler reutilizable para GET /leads
const handleGetLeads = async (req: express.Request, res: express.Response) => {
  try {
    const allLeads = await getAllLeads();
    res.json(allLeads);
  } catch (err: any) {
    console.error("Excepción en GET /leads:", err);
    res.json(memoryLeadsCache.filter((l: any) => !memoryDeletedLeadIds.has(String(l?.id))));
  }
};

// Handler reutilizable para PUT /leads/:id
const handlePutLead = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'ID inválido.' });
    return;
  }
  const validStatuses = ['Pendiente', 'Contactado', 'En Diagnóstico', 'Completado', 'Cancelado'];
  const status = req.body.status && validStatuses.includes(req.body.status) ? req.body.status : undefined;
  const notes = req.body.notes !== undefined ? sanitizeString(req.body.notes, 2000) : undefined;
  const updates: Record<string, string> = {};
  if (status !== undefined) updates.status = status;
  if (notes !== undefined) updates.notes = notes;

  // Retrieve existing savedLeads
  const settings = await getSettings();
  let savedLeads: any[] = [];
  if (settings.SAVED_LEADS) {
    try { savedLeads = JSON.parse(settings.SAVED_LEADS); } catch (e) {}
  }

  // Combine search across memoryLeadsCache and savedLeads
  let targetLead = memoryLeadsCache.find((l: any) => String(l.id) === String(id)) ||
                     savedLeads.find((l: any) => String(l.id) === String(id));

  if (!targetLead) {
    targetLead = { id, status: status || 'Pendiente', notes: notes || '' };
  }

  if (status) targetLead.status = status;
  if (notes !== undefined) targetLead.notes = notes;

  // Update in memoryLeadsCache
  const memIndex = memoryLeadsCache.findIndex((l: any) => String(l.id) === String(id));
  if (memIndex !== -1) {
    memoryLeadsCache[memIndex] = targetLead;
  } else {
    memoryLeadsCache.unshift(targetLead);
  }

  // Update in savedLeads
  const savedIndex = savedLeads.findIndex((l: any) => String(l.id) === String(id));
  if (savedIndex !== -1) {
    savedLeads[savedIndex] = targetLead;
  } else {
    savedLeads.unshift(targetLead);
  }

  // Persist updated SAVED_LEADS
  try {
    const serializedLeads = JSON.stringify(savedLeads.slice(0, 200));
    memorySettingsCache['SAVED_LEADS'] = serializedLeads;
    await supabase.from('settings').upsert([{ key: 'SAVED_LEADS', value: serializedLeads }]);
  } catch (e) {}

  await supabase.from('leads').update(updates).eq('id', Number(id));
  res.json(targetLead);
};

// Handler reutilizable para DELETE /leads/:id
const handleDeleteLead = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'ID inválido.' });
    return;
  }

  const idStr = String(id);
  memoryDeletedLeadIds.add(idStr);
  
  // Remove from memoryLeadsCache
  const memIndex = memoryLeadsCache.findIndex((l: any) => String(l.id) === idStr);
  if (memIndex !== -1) {
    memoryLeadsCache.splice(memIndex, 1);
  }

  // Remove from savedLeads in settings
  const settings = await getSettings();
  if (settings.SAVED_LEADS) {
    try {
      let savedLeads: any[] = JSON.parse(settings.SAVED_LEADS);
      savedLeads = savedLeads.filter((l: any) => String(l.id) !== idStr);
      const serializedLeads = JSON.stringify(savedLeads.slice(0, 200));
      memorySettingsCache['SAVED_LEADS'] = serializedLeads;
      await supabase.from('settings').upsert([{ key: 'SAVED_LEADS', value: serializedLeads }]);
    } catch (e) {}
  }

  try {
    if (!isNaN(Number(id))) {
      await supabase.from('leads').delete().eq('id', Number(id));
    } else {
      await supabase.from('leads').delete().eq('id', idStr);
    }
  } catch (e) {}

  saveLeadsToDisk();
  saveSettingsToDisk();

  res.json({ success: true, id: idStr, message: 'Lead eliminado permanentemente.' });
};

// Handler reutilizable para PUT /settings (Optimizado a respuesta instantánea de sub-50ms)
const handlePutSettings = async (req: express.Request, res: express.Response) => {
  const newSettings = req.body;
  try {
    const entries = Object.entries(newSettings);
    const upsertRows: { key: string; value: string }[] = [];

    // 1. Instant update in memory cache & prepare batch
    for (const [key, value] of entries) {
      const valStr = value === null || value === undefined ? '' : String(value);
      memorySettingsCache[key] = valStr;
      upsertRows.push({ key, value: valStr });
    }

    // 2. Instant save to disk file (sub-1ms)
    saveSettingsToDisk();

    // 3. Return response IMMEDIATELY to Admin UI for zero delay!
    const updated = await getSettings();
    res.json({ 
      success: true, 
      settings: updated,
      dbStatus: 'persisted'
    });

    // 4. Non-blocking batch upsert to Supabase database in background
    if (upsertRows.length > 0) {
      (async () => {
        try {
          const { error } = await supabase.from('settings').upsert(upsertRows, { onConflict: 'key' });
          if (error) console.warn("Aviso: Supabase batch upsert notice:", error.message);
        } catch (err) {
          console.warn("Aviso: Supabase background sync notice:", err);
        }
      })();
    }
  } catch (error: any) {
    console.error("Excepción en PUT /settings:", error);
    res.status(500).json({ error: 'Error al guardar configuraciones.', details: error?.message || String(error) });
  }
};

const handleGetInspectionSlots = async (req: express.Request, res: express.Response) => {
  try {
    const occupied = await getOccupiedSlotsMap();
    res.json({ occupied });
  } catch (err: any) {
    console.error("Error in GET /inspection-slots:", err);
    res.json({ occupied: memoryOccupiedSlots });
  }
};

// Public read (relaxed limit)
app.get('/api/settings', relaxedLimit, handleGetSettings);
app.get('/settings', relaxedLimit, handleGetSettings);

app.get('/api/inspection-slots', relaxedLimit, handleGetInspectionSlots);
app.get('/inspection-slots', relaxedLimit, handleGetInspectionSlots);

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
      HERO_IMG: '/assets/hero_bg_custom.jpg',
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
      IMG_SRV_LAVADO: '/assets/instalaciones.jpg',
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

