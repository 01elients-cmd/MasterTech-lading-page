import React, { useState, useEffect } from 'react';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const CONFIG_DEFAULT = {
  WHATSAPP_LINK: "https://wa.link/xnj37f",
  LOGO_URL: "/logo.png",
};

const DEFAULT_TEAM = [
  { id: 1, name: 'Jesús M.', role: 'Jefe de Mecánica', desc: 'Experto en diagnóstico avanzado y reparación de motores con más de 15 años de experiencia multimarca.', img: '/jesus.jpg' },
  { id: 2, name: 'Miguel A.', role: 'Especialista en Electrónica', desc: 'Ingeniero automotriz dedicado a la resolución de fallas eléctricas complejas y reprogramación de módulos.', img: '/assets/hero_bg.png' },
  { id: 3, name: 'Ana P.', role: 'Asesora de Servicio', desc: 'Encargada de la recepción, atención personalizada y seguimiento continuo del estatus de tu vehículo.', img: '/assets/instalaciones.jpg' }
];

export default function Nosotros() {
  const [config, setConfig] = useState<any>(CONFIG_DEFAULT);
  const [teamMembers, setTeamMembers] = useState<any[]>(DEFAULT_TEAM);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setConfig((prev: any) => ({ ...prev, ...data }));
          try {
            if (data.TEAM_MEMBERS_JSON) {
              setTeamMembers(JSON.parse(data.TEAM_MEMBERS_JSON));
            }
          } catch (e) {}
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
        <img src={config.LOGO_URL} alt="MasterTech" className="h-10 w-auto" />
        <a href={config.WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2 !px-6 text-xs border-none">
          Escríbenos
        </a>
      </header>

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
                Conoce al equipo
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-black tracking-tighter mb-6">
                NUESTRO <span className="text-primary italic">EQUIPO</span>
              </h1>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Profesionales apasionados por la mecánica y comprometidos con la excelencia, precisión y transparencia en cada servicio.
              </p>
            </div>

            {/* Team Grid */}
            <div className={`grid gap-8 mb-20 ${teamMembers.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : teamMembers.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3'}`}>
              {teamMembers.map((member, i) => (
                <div key={member.id || i} className="glass-card overflow-hidden group">
                  <div className="h-64 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#16181f] to-transparent z-10" />
                    <img src={member.img || "/assets/hero_bg.png"} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                  </div>
                  <div className="p-8 relative z-20 -mt-20">
                    <span className="text-xs font-black text-primary uppercase tracking-widest bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">{member.role}</span>
                    <h3 className="text-2xl font-black mt-4 mb-2">{member.name}</h3>
                    <p className="text-zinc-400 leading-relaxed text-sm">{member.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Box */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center max-w-xl mx-auto">
              <h3 className="text-3xl font-black mb-3">¿Listo para atender tu vehículo?</h3>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">Agenda tu cita con nuestro equipo de especialistas y vive la experiencia MasterTech.</p>
              <a
                href={config.WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-3 !py-4 !px-8 text-base border-none mx-auto"
              >
                AGENDAR CITA VÍA WHATSAPP <ArrowRight className="w-5 h-5" />
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
