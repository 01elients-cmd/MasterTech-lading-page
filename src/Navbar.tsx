import React, { useState } from 'react';
import { ChevronDown, Wrench, Package, Users, HelpCircle, ShieldCheck, ArrowRight, X, Menu, Phone, Sparkles, Filter } from 'lucide-react';
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
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
  </svg>
);

export default function Navbar({ activePage = 'inicio', config = DEFAULT_CONFIG }: NavbarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileAccordion, setExpandedMobileAccordion] = useState<string | null>(null);

  const cfg = { ...DEFAULT_CONFIG, ...(config || {}) };

  const servicesOptions = [
    { title: "Mecánica General & Mantenimiento", desc: "Diagnóstico de motor, aceite sintético 5W30 y filtros OEM", href: "/servicios#mecanica", icon: "🛠️" },
    { title: "Diagnóstico Electrónico & Inyección", desc: "Escáner computarizado multimarca y ultrasonido de inyectores", href: "/servicios#diagnostico", icon: "⚡" },
    { title: "Frenos, Suspensión & Climatización A/A", desc: "Pastillas cerámicas, discos, amortiguadores y gas R134a", href: "/servicios#frenos", icon: "🛑" }
  ];

  const catalogOptions = [
    { title: "Filtros & Consumibles OEM", desc: "Aire de motor, cabina carbón activado e inyectores", href: "/catalogo?cat=Filtros y Consumibles", icon: "💨" },
    { title: "Aceites & Lubricantes Sintéticos", desc: "Motul, Mobil 1, Pennzoil 5W-30, 10W-40 API SP", href: "/catalogo?cat=Aceites y Lubricantes", icon: "🛢️" },
    { title: "Pastillas de Freno & Amortiguadores", desc: "Compuestos cerámicos y amortiguadores a gas nitrógeno", href: "/catalogo?cat=Frenos y Suspensión", icon: "🛑" },
    { title: "Repuestos Importados desde USA 🇺🇸", desc: "Piezas originales bajo pedido especial con número OEM", href: "/catalogo", icon: "🇺🇸" }
  ];

  const nosotrosOptions = [
    { title: "Nuestro Equipo de Especialistas", desc: "Conoce a nuestros ingenieros y mecánicos certificados", href: "/nosotros", icon: "👥" },
    { title: "Garantía Total MasterTech", desc: "Respaldamos cada trabajo con garantía por escrito", href: "/nosotros", icon: "🛡️" },
    { title: "Instalaciones Lounge VIP", desc: "Área de espera climatizada con café y Wi-Fi de alta velocidad", href: "/nosotros", icon: "☕" }
  ];

  const faqOptions = [
    { title: "¿Cuánto tiempo toma un servicio preventivo?", desc: "De 45 min a 1.5 hrs con atención agendada", href: "/faq", icon: "⏱️" },
    { title: "¿Cuáles son los métodos de pago?", desc: "Zelle, Pago Móvil, Efectivo USD/EUR y Transferencias", href: "/faq", icon: "💳" },
    { title: "¿Tienen garantía los repuestos e instalaciones?", desc: "Garantía total MasterTech en repuestos y mano de obra", href: "/faq", icon: "🛡️" }
  ];

  return (
    <nav className="fixed w-full z-50 bg-[#0d0e12]/95 backdrop-blur-xl py-3 border-b border-white/10 top-0">
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
                        <span className="text-xl shrink-0">{opt.icon}</span>
                        <div>
                          <div className="text-white font-bold text-xs group-hover/item:text-primary transition-colors leading-snug">{opt.title}</div>
                          <div className="text-[11px] text-zinc-400 font-normal leading-tight mt-0.5">{opt.desc}</div>
                        </div>
                      </a>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-zinc-400 font-medium">⚡ Escáner Multimarca</span>
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
                        className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors group/item ${
                          opt.title.includes('USA') ? 'bg-blue-950/50 border border-blue-500/40 hover:bg-blue-900/60 hover:border-blue-400 mt-1.5 shadow-md shadow-blue-950/40' : 'hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xl shrink-0">{opt.icon}</span>
                        <div>
                          <div className="text-white font-bold text-xs group-hover/item:text-blue-400 transition-colors leading-snug">{opt.title}</div>
                          <div className="text-[11px] text-zinc-400 font-normal leading-tight mt-0.5">{opt.desc}</div>
                        </div>
                      </a>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-blue-400 font-bold flex items-center gap-1 shrink-0">
                      <span>🇺🇸 Pedidos OEM USA</span>
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
                      <span className="text-lg shrink-0">{opt.icon}</span>
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
            className="btn-primary !py-2 !px-5 text-xs border-none flex items-center gap-2 shadow-lg shadow-primary/30 ml-2"
          >
            <WhatsAppIcon size={16} />
            <span>Reserva Ahora</span>
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
                  <span>🛠️ Servicios Taller</span>
                  <ChevronDown size={18} className={`transition-transform duration-200 ${expandedMobileAccordion === 'servicios' ? 'rotate-180 text-primary' : ''}`} />
                </button>
                {expandedMobileAccordion === 'servicios' && (
                  <div className="pl-4 space-y-2.5 pt-2 text-xs">
                    {servicesOptions.map((opt, i) => (
                      <a
                        key={i}
                        href={opt.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-zinc-300 hover:text-white py-1 font-medium"
                      >
                        {opt.icon} {opt.title}
                      </a>
                    ))}
                    <a href="/servicios" onClick={() => setIsMobileMenuOpen(false)} className="block text-primary font-bold pt-1">
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
                  <span>📦 Catálogo Repuestos</span>
                  <ChevronDown size={18} className={`transition-transform duration-200 ${expandedMobileAccordion === 'catalogo' ? 'rotate-180 text-primary' : ''}`} />
                </button>
                {expandedMobileAccordion === 'catalogo' && (
                  <div className="pl-4 space-y-2.5 pt-2 text-xs">
                    {catalogOptions.map((opt, i) => (
                      <a
                        key={i}
                        href={opt.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-zinc-300 hover:text-white py-1 font-medium"
                      >
                        {opt.icon} {opt.title}
                      </a>
                    ))}
                    <a href="/catalogo" onClick={() => setIsMobileMenuOpen(false)} className="block text-primary font-bold pt-1">
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
                  <span>❓ Preguntas Frecuentes</span>
                  <ChevronDown size={18} className={`transition-transform duration-200 ${expandedMobileAccordion === 'faq' ? 'rotate-180 text-primary' : ''}`} />
                </button>
                {expandedMobileAccordion === 'faq' && (
                  <div className="pl-4 space-y-2 pt-2 text-xs">
                    {faqOptions.map((opt, i) => (
                      <a
                        key={i}
                        href={opt.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-zinc-300 hover:text-white py-1.5 font-medium"
                      >
                        {opt.icon} {opt.title}
                      </a>
                    ))}
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
