import React, { useState, useEffect } from 'react';
import { Plus, Minus, ArrowRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CONFIG_DEFAULT = {
  WHATSAPP_LINK: "https://wa.link/xnj37f",
  LOGO_URL: "/logo.png",
};

export default function Faq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [config, setConfig] = useState<any>(CONFIG_DEFAULT);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setConfig((prev: any) => ({ ...prev, ...data }));
        }
      } catch (err) {
        // silently fallback
      }
    };
    fetchSettings();
  }, []);

  const faqs = [
    {
      q: "¿Cuánto tiempo toma un mantenimiento preventivo básico?",
      a: "Típicamente entre 45 minutos y 1 hora y media. Puedes esperar cómodamente en nuestra sala VIP con café y Wi-Fi mientras trabajamos."
    },
    {
      q: "¿Tienen garantía los trabajos que realizan?",
      a: "Sí, todos nuestros servicios cuentan con la Garantía Total MasterTech. Nos hacemos responsables por la calidad de nuestra mano de obra y repuestos suministrados."
    },
    {
      q: "¿Tengo que comprar yo los repuestos?",
      a: "Para tu comodidad, contamos con un amplio almacén de repuestos originales y consumibles. Sin embargo, si prefieres traer los tuyos, también es totalmente válido."
    },
    {
      q: "¿Cómo agendo una cita para mi vehículo?",
      a: "Puedes agendar tu cita directamente desde nuestro sitio web haciendo clic en 'Reserva Ahora' o comunicándote vía WhatsApp a nuestro número oficial."
    },
    {
      q: "¿Cuáles son los métodos de pago aceptados?",
      a: "Aceptamos pago móvil, transferencias bancarias nacionales e internacionales, efectivo (USD/EUR) y Zelle."
    }
  ];

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
        <img src={config.LOGO_URL} alt="MasterTech" className="h-10 w-auto" />
        <a href={config.WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2 !px-6 text-xs border-none">
          Escríbenos
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16 relative z-10">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Title */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 text-primary font-bold text-xs uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Centro de ayuda
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-black tracking-tighter mb-4">
                PREGUNTAS <span className="text-primary italic">FRECUENTES</span>
              </h1>
              <p className="text-xl text-zinc-400 max-w-xl mx-auto">
                Resolvemos tus dudas más comunes de forma transparente.
              </p>
            </div>

            {/* Accordion */}
            <div className="space-y-4 mb-16">
              {faqs.map((faq, i) => (
                <div key={i} className="glass-card overflow-hidden">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left p-6 flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-lg pr-8">{faq.q}</span>
                    {openFaq === i ? <Minus className="w-5 h-5 text-primary shrink-0" /> : <Plus className="w-5 h-5 text-primary shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <div className="p-6 pt-0 text-zinc-400 leading-relaxed border-t border-white/5 mt-2">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* CTA Box */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center max-w-xl mx-auto">
              <h3 className="text-2xl font-black mb-2">¿Tienes otra pregunta?</h3>
              <p className="text-zinc-400 text-sm mb-6">Nuestro equipo de asesores está disponible en WhatsApp para ayudarte al instante.</p>
              <a
                href={config.WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-3 !py-4 !px-8 text-base border-none mx-auto"
              >
                HABLAR CON UN ASESOR <ArrowRight className="w-5 h-5" />
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
