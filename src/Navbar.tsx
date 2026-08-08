import React, { useState } from 'react';
import { 
  ChevronDown, Wrench, Package, Users, HelpCircle, ShieldCheck, ArrowRight, X, Menu, Phone, Sparkles, Filter, Zap, Disc, Droplet, Clock, CreditCard, Globe, Plane, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  activePage?: 'inicio' | 'nosotros' | 'servicios' | 'catalogo' | 'faq' | 'contacto';
  config?: any;
}

const DEFAULT_CONFIG = {
  PHONE_NUMBER: "+584123565012",
  WHATSAPP_LINK: "https://wa.link/xnj37f",
  LOGO_URL: "/logo.png",
};

const WhatsAppIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2a10 10 0 0 0-8.624 15.086L2 22l5.067-1.328A10 10 0 1 0 12 2zm5.457 14.28c-.244.686-1.413 1.309-1.977 1.393-.518.077-1.162.109-1.871-.116-.432-.137-.985-.32-1.693-.626-2.981-1.287-4.927-4.289-5.076-4.487-.149-.198-1.213-1.611-1.213-3.074 0-1.463.768-2.18 1.04-2.479.272-.298.594-.372.792-.372.198 0 .396.002.57.01.182.009.427-.069.669.51.247.595.841 2.058.916 2.206.075.149.124.323.025.521-.099.198-.149.322-.3.495-.149.174-.312.388-.446.521-.148.148-.303.309-.13.606.173.298.77 1.271 1.653 2.059 1.135 1.012 2.093 1.325 2.39 1.475.297.148.471.124.644-.075.173-.198.743-.867.94-1.164.199-.298.397-.249.67-.15.272.099 1.733.818 2.03.967.297.149.496.223.57.347.075.124.075.719-.173 1.414z"/>
  </svg>
);

const MasterTechIconBadge = ({ icon: IconComponent, isUSA = false }: { icon: any; isUSA?: boolean }) => (
  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-all ${
    isUSA
      ? 'bg-blue-950/80 border-blue-500/50 text-blue-400 group-hover/item:bg-blue-900 group-hover/item:border-blue-300'
      : 'bg-black/60 border-primary/30 text-primary group-hover/item:bg-primary/20 group-hover/item:border-primary'
  }`}>
    <IconComponent className="w-4 h-4 transition-transform group-hover/item:scale-110" />
  </div>
);

export default function Navbar({ activePage = 'inicio', config = DEFAULT_CONFIG }: NavbarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileAccordion, setExpandedMobileAccordion] = useState<string | null>(null);

  const cfg = { ...DEFAULT_CONFIG, ...(config || {}) };

  const servicesOptions = [
    { title: "Mecánica General & Mantenimiento", desc: "Diagnóstico de motor, aceite sintético 5W30 y filtros OEM", href: "/servicios#mecanica", icon: Wrench },
    { title: "Diagnóstico Electrónico & Inyección", desc: "Escáner computarizado multimarca y ultrasonido de inyectores", href: "/servicios#diagnostico", icon: Zap },
    { title: "Frenos, Suspensión & Climatización A/A", desc: "Pastillas cerámicas, discos, amortiguadores y gas R134a", href: "/servicios#frenos", icon: Disc }
  ];

  const catalogOptions = [
    { title: "Filtros & Consumibles OEM", desc: "Aire de motor, cabina carbón activado e inyectores", href: "/catalogo?cat=Filtros y Consumibles", icon: Filter },
    { title: "Aceites & Lubricantes Sintéticos", desc: "Motul, Mobil 1, Pennzoil 5W-30, 10W-40 API SP", href: "/catalogo?cat=Aceites y Lubricantes", icon: Droplet },
    { title: "Pastillas de Freno & Amortiguadores", desc: "Compuestos cerámicos y amortiguadores a gas nitrógeno", href: "/catalogo?cat=Frenos y Suspensión", icon: Disc },
    { title: "Repuestos Importados desde EE.UU.", desc: "Pedidos especiales con número de parte OEM y logística express", href: "/catalogo?import=usa#solicitud-usa", icon: Plane, isUSA: true }
  ];

  const faqOptions = [
    { title: "¿Cuánto tiempo toma un servicio preventivo?", desc: "De 45 min a 1.5 hrs con atención agendada", href: "/faq", icon: Clock },
    { title: "¿Cuáles son los métodos de pago?", desc: "Zelle, Pago Móvil, Efectivo USD/EUR y Transferencias", href: "/faq", icon: CreditCard },
    { title: "¿Tienen garantía los repuestos e instalaciones?", desc: "Garantía total MasterTech en repuestos y mano de obra", href: "/faq", icon: ShieldCheck }
  ];

  return (
    <nav className="fixed w-full z-50 bg-[#0D0D0D]/95 backdrop-blur-xl py-3 border-b border-[#8B8D91]/20 top-0 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center relative">
        {/* Brand Logo */}
        <a href="/" className="cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-2">
          <img src={cfg.LOGO_URL || "/logo.png"} alt="MasterTech" className="h-8 md:h-9 w-auto" />
        </a>

        {/* Desktop Links with Hover Mega Dropdowns */}
        <div className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-bold text-zinc-400">
          
          {/* Inicio Link */}
          <a 
            href="/" 
            className={`transition-colors py-2 ${
              activePage === 'inicio' ? 'text-primary font-black uppercase border-b-2 border-primary pb-0.5' : 'hover:text-white'
            }`}
          >
            Inicio
          </a>

          {/* Nosotros Direct Link */}
          <a 
            href="/nosotros" 
            className={`transition-colors py-2 ${
              activePage === 'nosotros' ? 'text-primary font-black uppercase border-b-2 border-primary pb-0.5' : 'hover:text-white'
            }`}
          >
            Nosotros
          </a>

          {/* Servicios Taller Mega Dropdown Trigger */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('servicios')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <a 
              href="/servicios"
              className={`flex items-center gap-1 transition-colors py-2 cursor-pointer ${
                activePage === 'servicios' ? 'text-primary font-black border-b-2 border-primary pb-0.5' : 'hover:text-white'
              }`}
            >
              <span>Servicios Taller</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'servicios' ? 'rotate-180 text-primary' : ''}`} />
            </a>

            <AnimatePresence>
              {activeDropdown === 'servicios' && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 w-[420px] bg-[#12141a]/95 border border-white/15 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl mt-1 z-50"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
                      <Wrench size={12} />
                      <span>Especialidades Principales</span>
                    </span>
                    <span className="text-[10px] text-zinc-400 font-bold">Diagnóstico Computarizado</span>
                  </div>

                  <div className="space-y-1">
                    {servicesOptions.map((opt, i) => (
                      <a
                        key={i}
                        href={opt.href}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors group/item"
                      >
                        <MasterTechIconBadge icon={opt.icon} />
                        <div>
                          <div className="text-white font-bold text-xs group-hover/item:text-primary transition-colors leading-snug">{opt.title}</div>
                          <div className="text-[11px] text-zinc-400 font-normal leading-tight mt-0.5">{opt.desc}</div>
                        </div>
                      </a>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-zinc-300 font-bold flex items-center gap-1.5 shrink-0">
                      <Cpu size={13} className="text-primary" />
                      <span>Escáner Multimarca</span>
                    </span>
                    <a href="/servicios" className="flex items-center gap-1 text-xs text-primary font-black hover:underline whitespace-nowrap shrink-0">
                      <span>Ver Todos los Servicios</span>
                      <ArrowRight size={12} />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Catálogo Repuestos Mega Dropdown Trigger */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('catalogo')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <a 
              href="/catalogo"
              className={`flex items-center gap-1 transition-colors py-2 cursor-pointer ${
                activePage === 'catalogo' ? 'text-primary font-black uppercase border-b-2 border-primary pb-0.5' : 'hover:text-white'
              }`}
            >
              <span>Catálogo Repuestos</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'catalogo' ? 'rotate-180 text-primary' : ''}`} />
            </a>

            <AnimatePresence>
              {activeDropdown === 'catalogo' && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full right-0 w-[440px] bg-[#12141a]/95 border border-white/15 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl mt-1 z-50"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
                      <Package size={12} />
                      <span>Categorías de Repuestos</span>
                    </span>
                    <span className="text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded-full">Stock en Taller</span>
                  </div>

                  <div className="space-y-1">
                    {catalogOptions.map((opt, i) => (
                      <a
                        key={i}
                        href={opt.href}
                        className={`flex items-start gap-3 p-3 rounded-xl transition-all group/item ${
                          opt.isUSA
                            ? 'bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-blue-900/60 border border-blue-500/50 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20 mt-2 relative overflow-hidden'
                            : 'hover:bg-white/10'
                        }`}
                      >
                        {opt.isUSA && (
                          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                            <Plane size={10} className="animate-pulse text-blue-400" />
                            <span>EXPRESS USA</span>
                          </div>
                        )}
                        <MasterTechIconBadge icon={opt.icon} isUSA={opt.isUSA} />
                        <div className="flex-1 pr-16">
                          <div className={`font-bold text-xs leading-snug transition-colors ${opt.isUSA ? 'text-white group-hover/item:text-blue-300' : 'text-white group-hover/item:text-primary'}`}>
                            {opt.title}
                          </div>
                          <div className="text-[11px] text-zinc-400 font-normal leading-tight mt-0.5">
                            {opt.desc}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-blue-400 font-bold flex items-center gap-1.5 shrink-0">
                      <Globe size={13} className="text-blue-400" />
                      <span>Logística Directa EE.UU.</span>
                    </span>
                    <a href="/catalogo" className="flex items-center gap-1 text-xs text-primary font-black hover:underline whitespace-nowrap shrink-0">
                      <span>Explorar Catálogo</span>
                      <ArrowRight size={12} />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Preguntas Frecuentes Dropdown Trigger */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('faq')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <a 
              href="/faq"
              className={`flex items-center gap-1 transition-colors py-2 cursor-pointer ${
                activePage === 'faq' ? 'text-primary font-black border-b-2 border-primary pb-0.5' : 'hover:text-white'
              }`}
            >
              <span>Preguntas Frecuentes</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'faq' ? 'rotate-180 text-primary' : ''}`} />
            </a>

            <AnimatePresence>
              {activeDropdown === 'faq' && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full right-0 w-80 bg-[#12141a]/95 border border-white/15 backdrop-blur-2xl rounded-2xl p-3 shadow-2xl space-y-1 mt-1 z-50"
                >
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary border-b border-white/10 mb-1 flex items-center gap-1">
                    <HelpCircle size={12} />
                    <span>Centro de Ayuda FAQ</span>
                  </div>
                  {faqOptions.map((opt, i) => (
                    <a
                      key={i}
                      href={opt.href}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors group/item"
                    >
                      <MasterTechIconBadge icon={opt.icon} />
                      <div>
                        <div className="text-white font-bold text-xs group-hover/item:text-primary transition-colors">{opt.title}</div>
                        <div className="text-[11px] text-zinc-400 font-normal leading-tight mt-0.5">{opt.desc}</div>
                      </div>
                    </a>
                  ))}
                  <div className="pt-2 border-t border-white/10">
                    <a href="/faq" className="flex items-center justify-between px-3 py-1.5 text-xs text-primary font-bold hover:underline">
                      <span>Ver todas las preguntas frecuentes</span>
                      <ArrowRight size={12} />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA Button */}
          <a 
            href={cfg.WHATSAPP_LINK || "https://wa.link/xnj37f"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !py-2.5 !px-5 text-xs font-black !text-[#0D0D0D] flex items-center gap-2 border-none ml-2 shrink-0"
          >
            <WhatsAppIcon size={16} className="!text-[#0D0D0D] fill-current" />
            <span className="font-black !text-[#0D0D0D] tracking-wide">Reserva Ahora</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="lg:hidden text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Menu with Accordions */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0d0e12]/98 border-b border-white/10 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Inicio */}
              <a
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base font-bold text-white hover:text-primary transition-colors py-2 border-b border-white/5"
              >
                🏠 Inicio
              </a>

              {/* Nosotros Direct Link */}
              <a
                href="/nosotros"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base font-bold text-white hover:text-primary transition-colors py-2 border-b border-white/5"
              >
                👥 Nosotros
              </a>

              {/* Servicios Taller Accordion */}
              <div className="border-b border-white/5 pb-2">
                <button
                  onClick={() => setExpandedMobileAccordion(expandedMobileAccordion === 'servicios' ? null : 'servicios')}
                  className="w-full flex items-center justify-between text-base font-bold text-white py-2"
                >
                  <span className="flex items-center gap-2">
                    <Wrench size={18} className="text-primary" />
                    <span>Servicios Taller</span>
                  </span>
                  <ChevronDown size={18} className={`transition-transform duration-200 ${expandedMobileAccordion === 'servicios' ? 'rotate-180 text-primary' : ''}`} />
                </button>
                {expandedMobileAccordion === 'servicios' && (
                  <div className="pl-2 space-y-2 pt-2 text-xs">
                    {servicesOptions.map((opt, i) => (
                      <a
                        key={i}
                        href={opt.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 text-zinc-300 hover:text-white py-1.5 font-medium group/item"
                      >
                        <MasterTechIconBadge icon={opt.icon} />
                        <span>{opt.title}</span>
                      </a>
                    ))}
                    <a href="/servicios" onClick={() => setIsMobileMenuOpen(false)} className="block text-primary font-bold pt-1.5 pl-11">
                      → Ver Todos los Servicios
                    </a>
                  </div>
                )}
              </div>

              {/* Catálogo Repuestos Accordion */}
              <div className="border-b border-white/5 pb-2">
                <button
                  onClick={() => setExpandedMobileAccordion(expandedMobileAccordion === 'catalogo' ? null : 'catalogo')}
                  className="w-full flex items-center justify-between text-base font-bold text-white py-2"
                >
                  <span className="flex items-center gap-2">
                    <Package size={18} className="text-primary" />
                    <span>Catálogo Repuestos</span>
                  </span>
                  <ChevronDown size={18} className={`transition-transform duration-200 ${expandedMobileAccordion === 'catalogo' ? 'rotate-180 text-primary' : ''}`} />
                </button>
                {expandedMobileAccordion === 'catalogo' && (
                  <div className="pl-2 space-y-2 pt-2 text-xs">
                    {catalogOptions.map((opt, i) => (
                      <a
                        key={i}
                        href={opt.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 text-zinc-300 hover:text-white py-1.5 font-medium group/item"
                      >
                        <MasterTechIconBadge icon={opt.icon} isUSA={opt.isUSA} />
                        <span>{opt.title}</span>
                      </a>
                    ))}
                    <a href="/catalogo" onClick={() => setIsMobileMenuOpen(false)} className="block text-primary font-bold pt-1.5 pl-11">
                      → Explorar Catálogo Completo
                    </a>
                  </div>
                )}
              </div>

              {/* Preguntas Frecuentes Accordion */}
              <div className="border-b border-white/5 pb-2">
                <button
                  onClick={() => setExpandedMobileAccordion(expandedMobileAccordion === 'faq' ? null : 'faq')}
                  className="w-full flex items-center justify-between text-base font-bold text-white py-2"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle size={18} className="text-primary" />
                    <span>Preguntas Frecuentes</span>
                  </span>
                  <ChevronDown size={18} className={`transition-transform duration-200 ${expandedMobileAccordion === 'faq' ? 'rotate-180 text-primary' : ''}`} />
                </button>
                {expandedMobileAccordion === 'faq' && (
                  <div className="pl-2 space-y-2 pt-2 text-xs">
                    {faqOptions.map((opt, i) => (
                      <a
                        key={i}
                        href={opt.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 text-zinc-300 hover:text-white py-1.5 font-medium group/item"
                      >
                        <MasterTechIconBadge icon={opt.icon} />
                        <span>{opt.title}</span>
                      </a>
                    ))}
                    <a href="/faq" onClick={() => setIsMobileMenuOpen(false)} className="block text-primary font-bold pt-1.5 pl-11">
                      → Ver todas las preguntas frecuentes
                    </a>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <a
                  href={cfg.WHATSAPP_LINK || "https://wa.link/xnj37f"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-center py-3 text-sm font-bold border-none flex items-center justify-center gap-2"
                >
                  <WhatsAppIcon size={18} />
                  <span>Reserva tu Cita por WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
