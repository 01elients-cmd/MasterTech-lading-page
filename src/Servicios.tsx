import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { ChevronLeft, Wrench, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const CONFIG_DEFAULT = {
  WHATSAPP_LINK: "https://wa.link/xnj37f",
  LOGO_URL: "/logo.png",
};

const WhatsAppIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
  </svg>
);

const DEFAULT_SERVICES = [
  { id: 1, title: "Mecánica General", desc: "Reparación profunda de motores, sustitución de embragues y solución de fallas mecánicas complejas con repuestos de alta calidad.", img: "/assets/servicio-mecanica.jpg" },
  { id: 2, title: "Mantenimiento Preventivo", desc: "Cambios de aceite sintético, reemplazo de filtros y fluidos esenciales para alargar la vida útil de tu motor.", img: "/24214142.png" },
  { id: 3, title: "Electricidad y Electrónica", desc: "Diagnóstico computarizado, reparación de alternadores, arranques y corrección de cableado y módulos electrónicos.", img: "/assets/servicio-electricidad.jpg" },
  { id: 4, title: "Frenos y Suspensión", desc: "Cambio de pastillas, rectificación de discos, reemplazo de amortiguadores y ajuste completo de tren delantero.", img: "/assets/servicio-frenos.jpg" },
  { id: 5, title: "Inyección Electrónica", desc: "Limpieza ultrasónica de inyectores, diagnóstico de bombas de gasolina y optimización del consumo de combustible.", img: "/assets/servicio-inyeccion.jpg" },
  { id: 6, title: "Climatización", desc: "Carga de gas refrigerante, detección de fugas y mantenimiento completo del sistema de aire acondicionado.", img: "/assets/servicio-climatizacion.jpg" },
  { id: 7, title: "Zona de Lavado", desc: "Lavado detallado de carrocería, limpieza profunda de motor e interior para entregar tu vehículo impecable.", img: "/assets/instalaciones.jpg" }
];

export default function Servicios() {
  const [config, setConfig] = useState<any>(CONFIG_DEFAULT);
  const [services, setServices] = useState<any[]>(DEFAULT_SERVICES);

  useEffect(() => {
    let localData: any = null;
    try {
      const stored = localStorage.getItem('mastertech_settings_store');
      if (stored) localData = JSON.parse(stored);
    } catch (e) {}

    if (localData) {
      setConfig((prev: any) => ({ ...prev, ...localData }));
      try { if (localData.SERVICES_JSON) setServices(JSON.parse(localData.SERVICES_JSON)); } catch (e) {}
    }

    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setConfig((prev: any) => ({ ...prev, ...data }));
          try {
            if (data.SERVICES_JSON) {
              setServices(JSON.parse(data.SERVICES_JSON));
            } else {
              setServices(DEFAULT_SERVICES.map(s => {
                let key = '';
                if (s.title.includes('Mecánica')) key = 'MECANICA';
                else if (s.title.includes('Mantenimiento')) key = 'MANTENIMIENTO';
                else if (s.title.includes('Electricidad')) key = 'ELECTRICIDAD';
                else if (s.title.includes('Frenos')) key = 'FRENOS';
                else if (s.title.includes('Inyección')) key = 'INYECCION';
                else if (s.title.includes('Climatización')) key = 'CLIMATIZACION';
                else if (s.title.includes('Lavado')) key = 'LAVADO';

                const customDesc = key ? data[`DESC_SRV_${key}`] : undefined;
                const customImg = key ? data[`IMG_SRV_${key}`] : undefined;
                return {
                  ...s,
                  desc: customDesc || s.desc,
                  img: customImg || s.img
                };
              }));
            }
          } catch (e) {}
          try { localStorage.setItem('mastertech_settings_store', JSON.stringify(data)); } catch (e) {}
        }
      } catch (err) {
        // silently fallback
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-primary selection:text-white flex flex-col overflow-x-hidden w-full max-w-full">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/8 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full" />
      </div>

      {/* Header with Dropdown Menus */}
      <Navbar activePage="servicios" config={config} />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16 relative z-10">
        <div className="w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Title Section */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 text-primary font-bold text-xs uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Catálogo de Servicios
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-black tracking-tighter mb-6">
                NUESTROS <span className="text-primary italic">SERVICIOS</span>
              </h1>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Soluciones integrales para tu vehículo con tecnología de punta y personal altamente capacitado.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {services.map((s, i) => (
                <div key={s.id || i} className="glass-card overflow-hidden hover:border-primary/50 transition-all group flex flex-col">
                  <div className="h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10" />
                    <img src={s.img || "/assets/instalaciones.jpg"} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-primary/20 transition-colors">
                      <Wrench className="w-6 h-6 text-primary icon-glow" />
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-black mb-3">{s.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed flex-1 mb-6">{s.desc}</p>
                    <a 
                      href={config.WHATSAPP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-primary hover:bg-primary/10 text-white py-3 px-4 rounded-xl font-bold transition-all group/btn"
                    >
                      Agendar ya <WhatsAppIcon size={18} className="text-primary group-hover/btn:text-white transition-colors fill-current" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Box */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center max-w-xl mx-auto">
              <h3 className="text-3xl font-black mb-3">¿Necesitas una revisión personalizada?</h3>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">Contáctanos por WhatsApp para consultar sobre fallas específicas o agendar tu cita de inmediato.</p>
              <a
                href={config.WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-3 !py-4 !px-8 text-base border-none mx-auto"
              >
                CONSULTAR VÍA WHATSAPP <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-zinc-600 text-xs border-t border-white/5 relative z-10 bg-black/40">
        © 2026 MASTERTECH AUTOMOTRIZ. Todos los derechos reservados.
      </footer>
    </div>
  );
}
