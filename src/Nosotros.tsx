import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const CONFIG_DEFAULT = {
  WHATSAPP_LINK: "https://wa.link/xnj37f",
  LOGO_URL: "/logo.png",
};

const DEFAULT_TEAM = [
  { id: 1, name: 'Jesús Mata', role: 'JEFE DE MECANICA', desc: 'Experto en diagnóstico avanzado y reparación de motores con más de 15 años de experiencia multimarca.', img: '/jesus.jpg' },
  { id: 2, name: 'J. Vicente Betancourt', role: 'CEO - DIRECTOR', desc: 'Dirección general y gestión estratégica de MasterTech Taller.', img: '/assets/instalaciones.jpg' },
  { id: 3, name: 'Brenda Santaella', role: 'COORDINADORA LOGISTICA', desc: 'Coordinación y gestión de repuestos e insumos automotrices.', img: '/assets/instalaciones.jpg' },
  { id: 4, name: 'Ambar Salazar', role: 'ASESORA DE LOGISTICA', desc: 'Atención directa y seguimiento continuo a clientes.', img: '/assets/instalaciones.jpg' },
  { id: 5, name: 'Aaron Rivas', role: 'TECNICO ELECTRONICA', desc: 'Especialista en diagnóstico computarizado y reprogramación de módulos.', img: '/assets/instalaciones.jpg' },
  { id: 6, name: 'Domingo Blandin', role: 'ASESOR DE SERVICIO', desc: 'Asesoría técnica personalizada y recepción de vehículos.', img: '/assets/instalaciones.jpg' },
  { id: 7, name: 'Beltran Lopez', role: 'TECNICO MECANICO', desc: 'Mantenimiento preventivo, correctivo y sistemas de suspensión.', img: '/assets/instalaciones.jpg' },
  { id: 8, name: 'Jose Vasquez', role: 'MARKETING - DESARROLLADOR WEB', desc: 'Desarrollo tecnológico, presencia digital y comunicación.', img: '/assets/instalaciones.jpg' }
];

export default function Nosotros() {
  const [config, setConfig] = useState<any>(CONFIG_DEFAULT);
  const [teamMembers, setTeamMembers] = useState<any[]>(DEFAULT_TEAM);

  useEffect(() => {
    let localData: any = null;
    try {
      const stored = localStorage.getItem('mastertech_settings_store');
      if (stored) localData = JSON.parse(stored);
    } catch (e) {}

    const loadTeam = (dataObj: any) => {
      if (dataObj?.TEAM_MEMBERS_JSON) {
        try {
          const parsed = JSON.parse(dataObj.TEAM_MEMBERS_JSON);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const hasLegacy = parsed.some((m: any) => m.name === 'Miguel A.' || m.name === 'Jesús M.' || m.name === 'Ana P.');
            if (!hasLegacy) {
              return parsed;
            }
          }
        } catch (e) {}
      }
      return DEFAULT_TEAM;
    };

    if (localData) {
      setConfig((prev: any) => ({ ...prev, ...localData }));
      const team = loadTeam(localData);
      if (team && team.length > 0) setTeamMembers(team);
    }

    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          // Purge legacy "Miguel A." / "Jesús M." from server response if present
          if (data?.TEAM_MEMBERS_JSON && (data.TEAM_MEMBERS_JSON.includes('Miguel A.') || data.TEAM_MEMBERS_JSON.includes('Jesús M.'))) {
            delete data.TEAM_MEMBERS_JSON;
          }

          let currentLocal: any = null;
          try {
            const stored = localStorage.getItem('mastertech_settings_store');
            if (stored) currentLocal = JSON.parse(stored);
          } catch (e) {}

          const merged = { ...data, ...(currentLocal || {}) };
          setConfig((prev: any) => ({ ...prev, ...merged }));
          try { localStorage.setItem('mastertech_settings_store', JSON.stringify(merged)); } catch (e) {}
          const team = loadTeam(merged);
          if (team && team.length > 0) setTeamMembers(team);
        }
      } catch (err) {}
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#E2E8F0] selection:bg-primary selection:text-black flex flex-col overflow-x-hidden w-full max-w-full">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/8 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full" />
      </div>

      {/* Header with Dropdown Menus */}
      <Navbar activePage="nosotros" config={config} />

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
            <div className={`grid gap-8 mb-20 ${teamMembers.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : teamMembers.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
              {teamMembers.map((member, i) => (
                <div key={member.id || i} className="glass-card overflow-hidden group flex flex-col h-full border border-[#8B8D91]/25 hover:border-primary/50 transition-all duration-300 shadow-xl">
                  {/* Photo Container with subtle gradient overlay */}
                  <div className="h-72 sm:h-80 overflow-hidden relative shrink-0 bg-[#0D0D0D]">
                    <img 
                      src={member.img || "/assets/instalaciones.jpg"} 
                      alt={member.name} 
                      className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2C3946] via-[#2C3946]/30 to-transparent" />
                  </div>

                  {/* Card Content Area */}
                  <div className="p-6 sm:p-7 flex flex-col flex-1 bg-[#2C3946] relative z-20 justify-between">
                    <div>
                      {/* Role Badge */}
                      <div className="mb-3">
                        <span className="inline-block text-[11px] font-black text-primary uppercase tracking-wider bg-primary/15 border border-primary/35 px-3 py-1 rounded-full shadow-sm">
                          {member.role || 'ESPECIALISTA'}
                        </span>
                      </div>
                      
                      {/* Member Name */}
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug mb-2.5 group-hover:text-primary transition-colors">
                        {member.name}
                      </h3>

                      {/* Profile Description */}
                      <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed font-normal">
                        {member.desc}
                      </p>
                    </div>
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
