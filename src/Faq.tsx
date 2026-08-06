import React, { useState, useEffect } from 'react';
import { Plus, Minus, ArrowRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CONFIG_DEFAULT = {
  WHATSAPP_LINK: "https://wa.link/xnj37f",
  LOGO_URL: "/logo.png",
};

const DEFAULT_FAQS = [
  {
    q: "¿Cuánto tiempo toma un mantenimiento preventivo básico?",
    a: "El tiempo estimado oscila entre 45 minutos y 1 hora y media, dependiendo del plan de servicio requerido. Durante la intervención, puede esperar cómodamente en nuestra área Lounge VIP, equipada con estación de café y conectividad Wi-Fi de alta velocidad."
  },
  {
    q: "¿Tienen garantía los trabajos que realizan?",
    a: "Absolutamente. Todos nuestros servicios están respaldados por la Garantía Total MasterTech. Cubrimos la mano de obra calificada y los componentes o consumibles suministrados en nuestras instalaciones, asegurando un estándar óptimo de durabilidad y rendimiento."
  },
  {
    q: "¿Cómo agendo una cita para mi vehículo?",
    a: "Puede gestionar su cita en tiempo real de dos formas: directamente desde nuestra plataforma web haciendo clic en el botón \"Reserva Ahora\", o comunicándose directamente con nuestro equipo de asesores de servicio vía WhatsApp."
  },
  {
    q: "¿Cuáles son los métodos de pago aceptados?",
    a: "Para su comodidad, disponemos de múltiples canales de pago: Pago Móvil, transferencias bancarias nacionales e internacionales, efectivo (USD/EUR) y Zelle."
  },
  {
    q: "¿Qué tipo de herramientas o tecnología utilizan para el diagnóstico?",
    a: "Contamos con equipos de diagnóstico computarizado y escáneres multimarca de última generación. Esto nos permite interactuar con los módulos electrónicos del vehículo, analizar datos en tiempo real y detectar fallas con precisión quirúrgica antes de cualquier reparación."
  },
  {
    q: "¿Puedo dejar mi vehículo en el taller si la reparación toma varios días?",
    a: "Sí. Disponemos de instalaciones cerradas con sistemas de seguridad activa y monitoreo para resguardar su vehículo si requiere procedimientos mecánicos o electrónicos complejos que extiendan el tiempo de entrega."
  },
  {
    q: "¿Me informan antes de realizar algún trabajo adicional en mi vehículo?",
    a: "Totalmente. Mantenemos una política de cero sorpresas. Si durante la inspección o diagnóstico detectamos alguna anomalía extra, nuestro asesor de servicio le enviará un reporte técnico detallado junto al presupuesto correspondiente para su aprobación previa por WhatsApp antes de proceder."
  }
];

export default function Faq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [config, setConfig] = useState<any>(CONFIG_DEFAULT);
  const [faqs, setFaqs] = useState<any[]>(DEFAULT_FAQS);

  useEffect(() => {
    let localData: any = null;
    try {
      const stored = localStorage.getItem('mastertech_settings_store');
      if (stored) localData = JSON.parse(stored);
    } catch (e) {}

    if (localData) {
      setConfig((prev: any) => ({ ...prev, ...localData }));
      try { if (localData.FAQS_JSON) setFaqs(JSON.parse(localData.FAQS_JSON)); } catch (e) {}
    }

    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setConfig((prev: any) => ({ ...prev, ...data }));
          try {
            if (data.FAQS_JSON) {
              setFaqs(JSON.parse(data.FAQS_JSON));
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

      {/* Header */}
      <header className="py-5 px-6 flex justify-between items-center border-b border-white/5 bg-[#0d0e12]/90 backdrop-blur-xl relative z-10 max-w-7xl mx-auto w-full">
        <a href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-bold">
          <ChevronLeft className="w-5 h-5 text-primary" /> Volver al Inicio
        </a>
        <a href="/" className="cursor-pointer hover:opacity-90 transition-opacity">
          <img src={config.LOGO_URL || "/logo.png"} alt="MasterTech" className="h-10 w-auto" />
        </a>
        <a href={config.WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2 !px-6 text-xs border-none">
          Escríbenos
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 lg:py-16 relative z-10">
        <div className="w-full max-w-6xl lg:max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Title */}
            <div className="text-center mb-10 lg:mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 text-primary font-bold text-xs uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Centro de ayuda
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tighter mb-3">
                PREGUNTAS <span className="text-primary italic">FRECUENTES</span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto font-medium">
                Resolvemos tus dudas más comunes de forma transparente.
              </p>
            </div>

            {/* 2-Column Grid Layout matching screenshot */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: FAQ Accordion List (Green Box) */}
              <div className="lg:col-span-7 space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="glass-card overflow-hidden">
                    <button 
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left p-5 sm:p-6 flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <span className="font-bold text-base sm:text-lg pr-4 text-white leading-snug">{faq.q}</span>
                      {openFaq === i ? <Minus className="w-5 h-5 text-primary shrink-0" /> : <Plus className="w-5 h-5 text-primary shrink-0" />}
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                        >
                          <div className="p-5 sm:p-6 pt-0 text-zinc-400 leading-relaxed border-t border-white/5 mt-1 text-sm sm:text-base">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Right Column: "¿Tienes otra pregunta?" CTA Card (Purple Box) */}
              <div className="lg:col-span-5 lg:sticky lg:top-28">
                <div className="glass-card p-8 text-center border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#181a24] to-[#111218]">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-6 shadow-[0_0_20px_rgba(255,42,42,0.15)]">
                    <ArrowRight className="w-8 h-8 -rotate-45" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-white mb-3">
                    ¿Tienes otra pregunta?
                  </h3>
                  <p className="text-zinc-400 text-sm sm:text-base mb-8 leading-relaxed">
                    Nuestro equipo de asesores está disponible en WhatsApp para ayudarte al instante.
                  </p>
                  <a
                    href={config.WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full !py-4 text-sm sm:text-base font-black uppercase tracking-widest border-none shadow-[0_10px_30px_rgba(229,57,53,0.4)] hover:scale-[1.02] transition-transform"
                  >
                    HABLAR CON UN ASESOR <ArrowRight className="w-5 h-5 ml-1" />
                  </a>
                </div>
              </div>

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
