import express from 'express';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Parse JSON body
app.use(express.json());

// Initialize SQLite database
const db = new Database('mastertech.db');

// Enable WAL mode for performance
db.pragma('journal_mode = WAL');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    telefono TEXT NOT NULL,
    vehiculo TEXT NOT NULL,
    servicio TEXT NOT NULL,
    status TEXT DEFAULT 'Pendiente',
    notes TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_used DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed default settings if they don't exist
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
  BANNER_TEXT: '¡Especialistas en vehículos Japoneses y Americanos! Garantía de 3 meses en todos los trabajos.'
};

const checkSettingsStmt = db.prepare('SELECT COUNT(*) as count FROM settings');
const { count } = checkSettingsStmt.get() as { count: number };

if (count === 0) {
  const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
  const transaction = db.transaction((settingsObj) => {
    for (const [key, value] of Object.entries(settingsObj)) {
      insertSetting.run(key, value as string);
    }
  });
  transaction(defaultSettings);
  console.log('Se han sembrado las configuraciones por defecto.');
}

// Helper: Get settings as object
function getSettings() {
  const allSettings = db.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[];
  const settingsObj: Record<string, string> = {};
  for (const s of allSettings) {
    settingsObj[s.key] = s.value;
  }
  return settingsObj;
}

// Authentication Middleware
const authenticateAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No autorizado. Se requiere token.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const session = db.prepare('SELECT token FROM sessions WHERE token = ?').get(token);

  if (!session) {
    res.status(401).json({ error: 'Token inválido o expirado.' });
    return;
  }

  // Update last used timestamp
  db.prepare('UPDATE sessions SET last_used = CURRENT_TIMESTAMP WHERE token = ?').run(token);
  next();
};

// --- ENDPOINTS PÚBLICOS ---

// Get Settings
app.get('/api/settings', (req, res) => {
  try {
    const settings = getSettings();
    res.json(settings);
  } catch (error) {
    console.error('Error al obtener configuraciones:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Submit Lead (From public booking form)
app.post('/api/leads', async (req, res) => {
  const { nombre, telefono, vehiculo, servicio } = req.body;

  if (!nombre || !telefono || !vehiculo || !servicio) {
    res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    return;
  }

  try {
    // Insert into database
    const insertLead = db.prepare(`
      INSERT INTO leads (nombre, telefono, vehiculo, servicio, status)
      VALUES (?, ?, ?, ?, 'Pendiente')
    `);
    const result = insertLead.run(nombre, telefono, vehiculo, servicio);
    const newLeadId = result.lastInsertRowid;

    // Fetch current settings to get Webhook URL
    const settings = getSettings();
    const webhookUrl = settings.WEBHOOK_URL;

    // Send to Google Sheets Webhook in background (without blocking response)
    if (webhookUrl && webhookUrl.startsWith('http')) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, telefono, vehiculo, servicio, timestamp: new Date().toISOString() }),
      }).catch(err => {
        console.error('Error al enviar al Webhook de Google Sheets:', err);
      });
    }

    res.status(201).json({
      success: true,
      leadId: newLeadId,
      message: 'Cita reservada correctamente.'
    });
  } catch (error) {
    console.error('Error al crear lead:', error);
    res.status(500).json({ error: 'Error del servidor al procesar la cita.' });
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (password === adminPassword) {
    // Generate secure random token
    const token = crypto.randomUUID();
    // Save session
    db.prepare('INSERT INTO sessions (token) VALUES (?)').run(token);
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Contraseña incorrecta' });
  }
});

// --- ENDPOINTS PROTEGIDOS (ADMINISTRACIÓN) ---

// Log out
app.post('/api/logout', authenticateAdmin, (req, res) => {
  const authHeader = req.headers.authorization!;
  const token = authHeader.split(' ')[1];
  try {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    res.json({ success: true, message: 'Sesión cerrada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al cerrar sesión.' });
  }
});

// Verify token validity
app.get('/api/verify-token', authenticateAdmin, (req, res) => {
  res.json({ valid: true });
});

// Get Leads List
app.get('/api/leads', authenticateAdmin, (req, res) => {
  try {
    const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
    res.json(leads);
  } catch (error) {
    console.error('Error al obtener leads:', error);
    res.status(500).json({ error: 'Error del servidor.' });
  }
});

// Update Lead Status or Notes
app.put('/api/leads/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  try {
    const currentLead = db.prepare('SELECT id FROM leads WHERE id = ?').get(id);
    if (!currentLead) {
       res.status(404).json({ error: 'Lead no encontrado.' });
       return;
    }

    if (status !== undefined && notes !== undefined) {
      db.prepare('UPDATE leads SET status = ?, notes = ? WHERE id = ?').run(status, notes, id);
    } else if (status !== undefined) {
      db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, id);
    } else if (notes !== undefined) {
      db.prepare('UPDATE leads SET notes = ? WHERE id = ?').run(notes, id);
    }

    const updatedLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
    res.json(updatedLead);
  } catch (error) {
    console.error('Error al actualizar lead:', error);
    res.status(500).json({ error: 'Error al actualizar registro.' });
  }
});

// Delete Lead
app.delete('/api/leads/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  try {
    const currentLead = db.prepare('SELECT id FROM leads WHERE id = ?').get(id);
    if (!currentLead) {
       res.status(404).json({ error: 'Lead no encontrado.' });
       return;
    }
    db.prepare('DELETE FROM leads WHERE id = ?').run(id);
    res.json({ success: true, message: 'Lead eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar lead:', error);
    res.status(500).json({ error: 'Error al eliminar registro.' });
  }
});

// Update Settings
app.put('/api/settings', authenticateAdmin, (req, res) => {
  const newSettings = req.body;

  try {
    const updateStmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    
    const transaction = db.transaction((settingsObj) => {
      for (const [key, value] of Object.entries(settingsObj)) {
        updateStmt.run(key, String(value));
      }
    });

    transaction(newSettings);
    res.json({ success: true, settings: getSettings() });
  } catch (error) {
    console.error('Error al actualizar configuraciones:', error);
    res.status(500).json({ error: 'Error al guardar configuraciones.' });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en puerto http://localhost:${PORT}`);
});
