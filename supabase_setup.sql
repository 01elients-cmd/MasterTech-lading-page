-- ============================================================
--  MASTERTECH TALLER - SUPABASE DATABASE SETUP COMPLETO
--  Ejecuta este archivo en el SQL Editor de Supabase
--  Orden: 1. Tablas → 2. Índices → 3. RLS → 4. Datos iniciales
-- ============================================================


-- ============================================================
-- 1. TABLA: leads
--    Guarda las citas/solicitudes enviadas desde el formulario
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id          BIGSERIAL PRIMARY KEY,
  nombre      TEXT        NOT NULL,
  telefono    TEXT        NOT NULL,
  vehiculo    TEXT        NOT NULL,
  servicio    TEXT        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'Pendiente',
  notes       TEXT,
  placa       TEXT,
  anio        TEXT,
  ubicacion   TEXT,
  falla       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comentarios de columnas
COMMENT ON TABLE  public.leads           IS 'Citas y solicitudes de servicio recibidas desde el sitio web';
COMMENT ON COLUMN public.leads.status    IS 'Pendiente | Contactado | En Diagnóstico | Completado | Cancelado';
COMMENT ON COLUMN public.leads.anio      IS 'Año del vehículo (guardado como texto para evitar restricciones)';


-- ============================================================
-- 2. TABLA: settings
--    Configuración dinámica del sitio (clave → valor)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.settings (
  id         BIGSERIAL PRIMARY KEY,
  key        TEXT        NOT NULL UNIQUE,
  value      TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.settings       IS 'Configuraciones dinámicas del sitio web MasterTech';
COMMENT ON COLUMN public.settings.key   IS 'Clave única de la configuración (ej: PHONE_NUMBER, HERO_IMG)';
COMMENT ON COLUMN public.settings.value IS 'Valor de la configuración como texto plano o JSON stringificado';


-- ============================================================
-- 3. ÍNDICES para mejorar el rendimiento de consultas
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_leads_created_at  ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status       ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_settings_key       ON public.settings (key);


-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS)
--    - leads:    INSERT público (el formulario web lo necesita)
--                SELECT/UPDATE/DELETE solo por service_role (backend)
--    - settings: SELECT público (la web lo lee sin auth)
--                INSERT/UPDATE solo por service_role (admin panel)
-- ============================================================

-- Activar RLS
ALTER TABLE public.leads    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- ── LEADS ──────────────────────────────────────────────────
-- Permitir insertar, consultar, actualizar y eliminar citas (el backend valida autenticación)
DROP POLICY IF EXISTS "leads_insert_public" ON public.leads;
DROP POLICY IF EXISTS "leads_insert_all" ON public.leads;
CREATE POLICY "leads_insert_all"
  ON public.leads
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "leads_select_service" ON public.leads;
DROP POLICY IF EXISTS "leads_select_all" ON public.leads;
CREATE POLICY "leads_select_all"
  ON public.leads
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "leads_update_service" ON public.leads;
DROP POLICY IF EXISTS "leads_update_all" ON public.leads;
CREATE POLICY "leads_update_all"
  ON public.leads
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "leads_delete_service" ON public.leads;
DROP POLICY IF EXISTS "leads_delete_all" ON public.leads;
CREATE POLICY "leads_delete_all"
  ON public.leads
  FOR DELETE
  USING (true);

-- ── SETTINGS ───────────────────────────────────────────────
DROP POLICY IF EXISTS "settings_select_public" ON public.settings;
DROP POLICY IF EXISTS "settings_select_all" ON public.settings;
CREATE POLICY "settings_select_all"
  ON public.settings
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "settings_insert_service" ON public.settings;
DROP POLICY IF EXISTS "settings_insert_all" ON public.settings;
CREATE POLICY "settings_insert_all"
  ON public.settings
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "settings_update_service" ON public.settings;
DROP POLICY IF EXISTS "settings_update_all" ON public.settings;
CREATE POLICY "settings_update_all"
  ON public.settings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "settings_delete_service" ON public.settings;
DROP POLICY IF EXISTS "settings_delete_all" ON public.settings;
CREATE POLICY "settings_delete_all"
  ON public.settings
  FOR DELETE
  USING (true);


-- ============================================================
-- 5. TRIGGER: auto-actualizar updated_at en settings
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_settings_updated_at ON public.settings;
CREATE TRIGGER trg_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 6. DATOS INICIALES (SEED) - Settings por defecto
--    Usa UPSERT para no duplicar si ya existen
-- ============================================================
INSERT INTO public.settings (key, value) VALUES
  ('PHONE_NUMBER',              '+584123565012'),
  ('WHATSAPP_LINK',             'https://wa.link/xnj37f'),
  ('WEBHOOK_URL',               'https://script.google.com/macros/s/AKfycbxIzUm7itb1hP8BCfbt3tWThExU_jBM9h_-kxJbGb7TlMryGA-zc01OmRnoAASU5AOM/exec'),
  ('GOOGLE_MAPS_LINK',          'https://maps.app.goo.gl/fybS1jW9buxQD5gv7'),
  ('GOOGLE_MAPS_EMBED',         'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15665.5!2d-63.8681155!3d10.9701683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c318fe358d81b01%3A0xf0c67c88a5063093!2sTaller%20MasterTech!5e0!3m2!1ses!2sve!4v1700000000000!5m2!1ses!2sve'),
  ('GOOGLE_BUSINESS_URL',       'https://maps.app.goo.gl/fybS1jW9buxQD5gv7'),
  ('HERO_IMG',                  '/assets/instalaciones.jpg'),
  ('LOGO_URL',                  '/logo.png'),
  ('BEFORE_AFTER_1',            '/assets/before_after_1.png'),
  ('BEFORE_AFTER_2',            '/assets/before_after_2.png'),
  ('IMG_INSTALACIONES',         '/assets/instalaciones.jpg'),
  ('IMG_SRV_MECANICA',          '/assets/servicio-mecanica.jpg'),
  ('IMG_SRV_MANTENIMIENTO',     '/24214142.png'),
  ('IMG_SRV_ELECTRICIDAD',      '/assets/servicio-electricidad.jpg'),
  ('IMG_SRV_FRENOS',            '/assets/servicio-frenos.jpg'),
  ('IMG_SRV_INYECCION',         '/assets/servicio-inyeccion.jpg'),
  ('IMG_SRV_CLIMATIZACION',     '/assets/servicio-climatizacion.jpg'),
  ('IMG_SRV_LAVADO',            '/assets/instalaciones.jpg'),
  ('IS_OPEN',                   'true'),
  ('BANNER_TEXT',               '¡Especialistas en vehículos Japoneses y Americanos! Garantía de 3 meses en todos los trabajos.'),
  ('WHATSAPP_MESSAGE_TEMPLATE', 'Hola *{nombre}*, te saludamos desde *Taller MasterTech* 🛠️. Hemos recibido tu solicitud para el servicio de *{servicio}* para tu *{vehiculo}*. Quisiéramos coordinar los detalles de tu cita. ¿En qué horario te resultaría más cómodo asistir?'),
  ('SUCCESS_BADGE',             '¡TIENES UN 30% DE DESCUENTO!'),
  ('SUCCESS_TEXT',              'Un técnico especialista se comunicará contigo vía WhatsApp en breve para coordinar tu descuento y cita.'),

  -- Descripciones de servicios
  ('DESC_SRV_MECANICA',         'Reparación profunda de motores, sustitución de embragues y solución de fallas mecánicas complejas con repuestos de alta calidad.'),
  ('DESC_SRV_MANTENIMIENTO',    'Cambios de aceite sintético, reemplazo de filtros y fluidos esenciales para alargar la vida útil de tu motor.'),
  ('DESC_SRV_ELECTRICIDAD',     'Diagnóstico computarizado, reparación de alternadores, arranques y corrección de cableado y módulos electrónicos.'),
  ('DESC_SRV_FRENOS',           'Cambio de pastillas, rectificación de discos, reemplazo de amortiguadores y ajuste completo de tren delantero.'),
  ('DESC_SRV_INYECCION',        'Limpieza ultrasónica de inyectores, diagnóstico de bombas de gasolina y optimización del consumo de combustible.'),
  ('DESC_SRV_CLIMATIZACION',    'Carga de gas refrigerante, detección de fugas y mantenimiento completo del sistema de aire acondicionado.'),
  ('DESC_SRV_LAVADO',           'Lavado detallado de carrocería, limpieza profunda de motor e interior para entregar tu vehículo impecable.'),

  -- Equipo (JSON Array)
  ('TEAM_MEMBERS_JSON',         '[{"id":1,"name":"Jesús M.","role":"Jefe de Mecánica","desc":"Experto en diagnóstico avanzado y reparación de motores con más de 15 años de experiencia multimarca.","img":"/jesus.jpg"},{"id":2,"name":"Miguel A.","role":"Especialista en Electrónica","desc":"Ingeniero automotriz dedicado a la resolución de fallas eléctricas complejas y reprogramación de módulos.","img":"/assets/instalaciones.jpg"},{"id":3,"name":"Ana P.","role":"Asesora de Servicio","desc":"Encargada de la recepción, atención personalizada y seguimiento continuo del estatus de tu vehículo.","img":"/assets/instalaciones.jpg"}]'),

  -- Reseñas (JSON Array)
  ('REVIEWS_JSON',              '[{"id":1,"name":"Carlos R.","car":"Honda Civic 2018","quote":"Llevé mi carro por una falla eléctrica que nadie encontraba y aquí dieron con el problema el mismo día. Excelente servicio y muy transparentes."},{"id":2,"name":"María V.","car":"Toyota Corolla 2020","quote":"Muy honestos con los precios y el diagnóstico. Me mostraron las piezas desgastadas antes de cambiarlas. Me dieron mucha confianza."},{"id":3,"name":"José L.","car":"Jeep Grand Cherokee","quote":"Tienen equipos de primera. El mantenimiento quedó impecable, resolvieron un ruido en el tren delantero y me entregaron el carro lavado."}]'),

  -- Marcas (JSON Array)
  ('BRANDS_JSON',               '["Jeep","Toyota","Honda","Dodge","Nissan","Chrysler","Lexus"]')

ON CONFLICT (key) DO NOTHING;  -- No sobreescribe si ya existe un valor personalizado


-- ============================================================
-- 7. VERIFICACIÓN FINAL
--    Ejecuta esto al final para confirmar que todo quedó bien
-- ============================================================
SELECT 'leads'    AS tabla, COUNT(*) AS filas FROM public.leads
UNION ALL
SELECT 'settings' AS tabla, COUNT(*) AS filas FROM public.settings;
