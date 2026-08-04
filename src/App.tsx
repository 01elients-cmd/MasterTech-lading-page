/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Settings, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  CheckCircle2,
  Menu,
  X,
  Calendar,
  User,
  Car,
  ChevronDown,
  Wrench,
  Search,
  Award,
  Activity,
  ArrowRight,
  Plus,
  Minus,
  Instagram,
  Youtube
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AdminPanel from './AdminPanel';
import Inspeccion from './Inspeccion';
import Contacto from './Contacto';
import Faq from './Faq';
import Nosotros from './Nosotros';
import Servicios from './Servicios';
import Catalogo from './Catalogo';
import InspectionSlotPicker from './InspectionSlotPicker';

const TikTokIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.901 2.894 2.896 2.896 0 0 1-2.894-2.894 2.896 2.896 0 0 1 2.894-2.894c.328 0 .64.053.93.15V9.458a6.326 6.326 0 0 0-.93-.07 6.34 6.34 0 0 0-6.335 6.336 6.34 6.34 0 0 0 6.335 6.335 6.34 6.34 0 0 0 6.336-6.335V8.756a8.21 8.21 0 0 0 4.78 1.488V6.8a4.815 4.815 0 0 1-1.005-.114z" />
  </svg>
);

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

function isDirectVideoUrl(url?: string): boolean {
  if (!url) return false;
  const clean = (url || '').trim().toLowerCase();
  return clean.endsWith('.mp4') || clean.endsWith('.webm') || clean.endsWith('.mov') || clean.includes('/assets/') || clean.startsWith('data:video');
}

function getInstagramEmbedUrl(url?: string): string {
  const defaultUrl = "https://www.instagram.com/reel/DYQxwH6jywd/";
  const target = (url && url.trim()) ? url.trim() : defaultUrl;
  const match = target.match(/(?:reel|p|tv)\/([A-Za-z0-9_-]+)/);
  if (match && match[1]) {
    return `https://www.instagram.com/reel/${match[1]}/embed`;
  }
  return "https://www.instagram.com/reel/DYQxwH6jywd/embed";
}

// --- CONFIGURACIÓN ---
const CONFIG = {
  PHONE_NUMBER: "+584123565012", 
  WHATSAPP_LINK: "https://wa.link/xnj37f", 
  WEBHOOK_URL: "https://script.google.com/macros/s/AKfycbxIzUm7itb1hP8BCfbt3tWThExU_jBM9h_-kxJbGb7TlMryGA-zc01OmRnoAASU5AOM/exec", 
  GOOGLE_MAPS_LINK: "https://maps.app.goo.gl/fybS1jW9buxQD5gv7",
  INSTAGRAM_LINK: "https://www.instagram.com/tallermastertech/",
  TIKTOK_LINK: "https://www.tiktok.com/@tallermastertech",
  YOUTUBE_LINK: "https://www.youtube.com/@tallermastertech",
  HERO_REEL_URL: "https://www.instagram.com/reel/DYQxwH6jywd/",
  GOOGLE_MAPS_EMBED: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15665.5!2d-63.8681155!3d10.9701683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c318fe358d81b01%3A0xf0c67c88a5063093!2sTaller%20MasterTech!5e0!3m2!1ses!2sve!4v1700000000000!5m2!1ses!2sve",
  GOOGLE_BUSINESS_URL: "https://maps.app.goo.gl/fybS1jW9buxQD5gv7",
  HERO_IMG: "/assets/hero_bg_custom.jpg",
  LOGO_URL: "/logo.png", 
  BEFORE_AFTER_1: "/assets/before_after_1.png",
  BEFORE_AFTER_2: "/assets/before_after_2.png",
  SUCCESS_BADGE: "¡TIENES HASTA UN 15% DE DESCUENTO!",
  SUCCESS_TEXT: "Un técnico especialista se comunicará contigo vía WhatsApp en breve para coordinar tu descuento y cita."
};

const DEFAULT_SERVICES = [
  { id: 1, title: "Mecánica General", desc: "Reparación profunda de motores, sustitución de embragues y solución de fallas mecánicas complejas con repuestos de alta calidad.", img: "/assets/servicio-mecanica.jpg" },
  { id: 2, title: "Mantenimiento Preventivo", desc: "Cambios de aceite sintético, reemplazo de filtros y fluidos esenciales para alargar la vida útil de tu motor.", img: "/24214142.png" },
  { id: 3, title: "Electricidad y Electrónica", desc: "Diagnóstico computarizado, reparación de alternadores, arranques y corrección de cableado y módulos electrónicos.", img: "/assets/servicio-electricidad.jpg" },
  { id: 4, title: "Frenos y Suspensión", desc: "Cambio de pastillas, rectificación de discos, reemplazo de amortiguadores y ajuste completo de tren delantero.", img: "/assets/servicio-frenos.jpg" },
  { id: 5, title: "Inyección Electrónica", desc: "Limpieza ultrasónica de inyectores, diagnóstico de bombas de gasolina y optimización del consumo de combustible.", img: "/assets/servicio-inyeccion.jpg" },
  { id: 6, title: "Climatización", desc: "Carga de gas refrigerante, detección de fugas y mantenimiento completo del sistema de aire acondicionado.", img: "/assets/servicio-climatizacion.jpg" },
  { id: 7, title: "Zona de Lavado", desc: "Lavado detallado de carrocería, limpieza profunda de motor e interior para entregar tu vehículo impecable.", img: "/assets/instalaciones.jpg" }
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedService, setSelectedService] = useState<string>('Línea de inspección gratuita');
  const [inspectionSlotStr, setInspectionSlotStr] = useState<string>('');
  const [isInspectionSlotValid, setIsInspectionSlotValid] = useState<boolean>(false);

  // Dynamic config initialized with static CONFIG fallback
  const [config, setConfig] = useState<any>(CONFIG);
  const [isAdmin, setIsAdmin] = useState(
    window.location.pathname === '/admin' || window.location.hash === '#admin'
  );
  const [isInspeccion, setIsInspeccion] = useState(
    window.location.pathname === '/inspeccion'
  );
  const [isContacto, setIsContacto] = useState(
    window.location.pathname === '/contacto'
  );
  const [isFaq, setIsFaq] = useState(
    window.location.pathname.toLowerCase() === '/faq'
  );
  const [isNosotros, setIsNosotros] = useState(
    window.location.pathname.toLowerCase() === '/nosotros'
  );
  const [isServicios, setIsServicios] = useState(
    window.location.pathname.toLowerCase() === '/servicios'
  );
  const [isCatalogo, setIsCatalogo] = useState(
    window.location.pathname.toLowerCase() === '/catalogo'
  );

  // Dynamic JSON arrays for team, reviews, and brands
  const [teamMembers, setTeamMembers] = useState<any[]>([
    { id: 1, name: 'Jesús M.', role: 'Jefe de Mecánica', desc: 'Experto en diagnóstico avanzado y reparación de motores con más de 15 años de experiencia multimarca.', img: '/jesus.jpg' },
    { id: 2, name: 'Miguel A.', role: 'Especialista en Electrónica', desc: 'Ingeniero automotriz dedicado a la resolución de fallas eléctricas complejas y reprogramación de módulos.', img: '/assets/instalaciones.jpg' },
    { id: 3, name: 'Ana P.', role: 'Asesora de Servicio', desc: 'Encargada de la recepción, atención personalizada y seguimiento continuo del estatus de tu vehículo.', img: '/assets/instalaciones.jpg' }
  ]);
  const [reviews, setReviews] = useState<any[]>([
    { id: 1, name: 'Carlos R.', car: 'Honda Civic 2018', quote: 'Llevé mi carro por una falla eléctrica que nadie encontraba y aquí dieron con el problema el mismo día. Excelente servicio y muy transparentes.' },
    { id: 2, name: 'María V.', car: 'Toyota Corolla 2020', quote: 'Muy honestos con los precios y el diagnóstico. Me mostraron las piezas desgastadas antes de cambiarlas. Me dieron mucha confianza.' },
    { id: 3, name: 'José L.', car: 'Jeep Grand Cherokee', quote: 'Tienen equipos de primera. El mantenimiento quedó impecable, resolvieron un ruido en el tren delantero y me entregaron el carro lavado.' }
  ]);
  const [brands, setBrands] = useState<string[]>([
    "Jeep", "Toyota", "Honda", "Dodge", "Nissan", "Chrysler", "Lexus"
  ]);
  const [services, setServices] = useState<any[]>(DEFAULT_SERVICES);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // 1. Instant load from local storage cache for 0ms initial render
    let localData: any = null;
    try {
      const stored = localStorage.getItem('mastertech_settings_store');
      if (stored) localData = JSON.parse(stored);
    } catch (e) {}

    if (localData) {
      if (localData.SUCCESS_BADGE && localData.SUCCESS_BADGE.includes('30%')) {
        localData.SUCCESS_BADGE = '¡TIENES HASTA UN 15% DE DESCUENTO!';
      }
      setConfig((prev: any) => ({ ...prev, ...localData }));
      try { if (localData.TEAM_MEMBERS_JSON) setTeamMembers(JSON.parse(localData.TEAM_MEMBERS_JSON)); } catch (e) {}
      try { if (localData.REVIEWS_JSON) setReviews(JSON.parse(localData.REVIEWS_JSON)); } catch (e) {}
      try { if (localData.BRANDS_JSON) setBrands(JSON.parse(localData.BRANDS_JSON)); } catch (e) {}
      try { if (localData.SERVICES_JSON) setServices(JSON.parse(localData.SERVICES_JSON)); } catch (e) {}
    }

    // 2. Fetch server settings and sync across devices
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.SUCCESS_BADGE && data.SUCCESS_BADGE.includes('30%')) {
            data.SUCCESS_BADGE = '¡TIENES HASTA UN 15% DE DESCUENTO!';
          }
          setConfig((prev: any) => ({ ...prev, ...data }));
          try { if (data.TEAM_MEMBERS_JSON) setTeamMembers(JSON.parse(data.TEAM_MEMBERS_JSON)); } catch (e) {}
          try { if (data.REVIEWS_JSON) setReviews(JSON.parse(data.REVIEWS_JSON)); } catch (e) {}
          try { if (data.BRANDS_JSON) setBrands(JSON.parse(data.BRANDS_JSON)); } catch (e) {}
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
        console.error("Error cargando configuración dinámica:", err);
      }
    };
    fetchSettings();
    const interval = setInterval(fetchSettings, 4000);
    return () => clearInterval(interval);

    // Internal router listener
    const handleHashChange = () => {
      setIsAdmin(window.location.pathname === '/admin' || window.location.hash === '#admin');
      setIsInspeccion(window.location.pathname === '/inspeccion');
      setIsContacto(window.location.pathname === '/contacto');
      setIsFaq(window.location.pathname.toLowerCase() === '/faq');
      setIsNosotros(window.location.pathname.toLowerCase() === '/nosotros');
      setIsServicios(window.location.pathname.toLowerCase() === '/servicios');
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('loading');
    setFormErrorMessage('');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (selectedService === 'Línea de inspección gratuita') {
      if (inspectionSlotStr) {
        data.fecha_hora = inspectionSlotStr;
      }
    }

    // Create local lead object immediately for client-side storage
    const localLead = {
      id: Date.now(),
      nombre: String(data.nombre || ''),
      telefono: String(data.telefono || ''),
      vehiculo: String(data.vehiculo || ''),
      servicio: String(data.servicio || ''),
      status: 'Pendiente',
      falla: String(data.falla || data.descripcion || ''),
      fecha_hora: String(data.fecha_hora || ''),
      created_at: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('mastertech_leads_store') || '[]');
      existing.unshift(localLead);
      localStorage.setItem('mastertech_leads_store', JSON.stringify(existing.slice(0, 100)));
    } catch (e) {}

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.lead) {
          try {
            const existing = JSON.parse(localStorage.getItem('mastertech_leads_store') || '[]');
            const filtered = existing.filter((l: any) => l.id !== localLead.id);
            filtered.unshift(json.lead);
            localStorage.setItem('mastertech_leads_store', JSON.stringify(filtered.slice(0, 100)));
          } catch (e) {}
        }
        setFormStatus('success');
      } else {
        if (res.status === 409) {
          const json = await res.json();
          alert(json.error || "El turno seleccionado ya fue reservado por otro usuario. Por favor selecciona otro turno libre.");
          setFormStatus('idle');
          return;
        }
        setFormStatus('success');
      }
    } catch (error) {
      console.warn("Fetch completed with local storage sync:", error);
      setFormStatus('success');
    }
  };

  if (isAdmin) {
    return (
      <AdminPanel 
        onClose={() => {
          window.location.hash = '';
          if (window.location.pathname === '/admin') {
            window.history.pushState({}, '', '/');
          }
          setIsAdmin(false);
        }} 
      />
    );
  }

  if (isInspeccion) {
    return <Inspeccion />;
  }

  if (isContacto) {
    return <Contacto />;
  }

  if (isFaq) {
    return <Faq />;
  }

  if (isNosotros) {
    return <Nosotros />;
  }

  if (isServicios) {
    return <Servicios />;
  }

  if (isCatalogo) {
    return <Catalogo />;
  }

  return (
    <div className="min-h-screen selection:bg-primary selection:text-white bg-[#0a0a0a] overflow-x-hidden w-full max-w-full">
      {/* WhatsApp Button */}
      <a 
        href={config.WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] p-4 rounded-full shadow-2xl hover:scale-110 transition-transform animate-float flex items-center justify-center group"
      >
        <span className="absolute right-full mr-3 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">¡Escríbenos ahora!</span>
        <WhatsAppIcon size={28} className="text-white fill-current" />
      </a>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 top-0 ${isScrolled ? 'bg-[#0d0e12]/90 backdrop-blur-xl py-2.5 border-b border-white/5' : 'bg-transparent py-3.5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <img src={config.LOGO_URL} alt="MasterTech" className="h-8 md:h-9 w-auto" />
          </motion.div>

          <div className="hidden lg:flex items-center gap-8">
            <a href="/nosotros" className="text-xs sm:text-sm font-bold text-zinc-400 hover:text-white transition-colors">Nosotros</a>
            <a href="/servicios" className="text-xs sm:text-sm font-bold text-zinc-400 hover:text-white transition-colors">Servicios</a>
            <a href="/catalogo" className="text-xs sm:text-sm font-bold text-zinc-400 hover:text-white transition-colors">Catálogo</a>
            <a href="#instalaciones" className="text-xs sm:text-sm font-bold text-zinc-400 hover:text-white transition-colors">Instalaciones</a>
            <a href="/faq" className="text-xs sm:text-sm font-bold text-zinc-400 hover:text-white transition-colors">Preguntas Frecuentes</a>
            <a href="#contacto" className="btn-primary !py-2 !px-6 text-xs border-none">Reserva Ahora</a>
          </div>

          <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-40 bg-[#0d0e12]/95 backdrop-blur-lg flex flex-col items-center justify-center p-6 lg:hidden"
          >
            <div className="flex flex-col gap-8 text-center">
              {[
                { label: 'Nosotros', href: '/nosotros' },
                { label: 'Servicios', href: '/servicios' },
                { label: 'Catálogo', href: '/catalogo' },
                { label: 'Instalaciones', href: '#instalaciones' },
                { label: 'Preguntas Frecuentes', href: '/faq' },
                { label: 'Contacto', href: '#contacto' }
              ].map((item) => (
                <a 
                  key={item.label} 
                  href={item.href} 
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-3xl font-display font-black hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-20 pb-8 lg:pt-24 lg:pb-12 px-4 sm:px-6 overflow-hidden min-h-[calc(100vh-70px)] flex flex-col justify-center items-center">
        {/* Workshop Background Image & Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src={config.HERO_IMG || "/assets/hero_bg_custom.jpg"} 
            alt="MasterTech Taller" 
            className="w-full h-full object-cover object-center brightness-90 contrast-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/40" />
        </div>
        
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-4 text-xs font-bold text-white shadow-lg">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(255,42,42,0.8)]" />
                ★ Tecnología y Precisión Automotriz
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-black tracking-tighter mb-4 leading-[1.1] text-white">
                TU VEHÍCULO MERECE <br />
                <span className="text-primary" style={{ textShadow: '0 0 35px rgba(255,42,42,0.6)' }}>ATENCIÓN EXPERTA</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-zinc-300 mb-6 max-w-md lg:max-w-lg leading-relaxed font-medium">
                Elevamos el estándar del servicio automotriz con diagnóstico avanzado, repuestos de primera y un equipo altamente capacitado listo para resolver cualquier falla.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#contacto" className="btn-primary !px-7 !py-3.5 text-sm sm:text-base border-none shadow-[0_10px_30px_rgba(229,57,53,0.4)]">
                  Agendar Cita <ArrowRight className="w-4 h-4 ml-2" />
                </a>
                <a href="/servicios" className="btn-secondary !px-7 !py-3.5 text-sm sm:text-base bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white">
                  Ver Servicios
                </a>
              </div>
              
              <div className="mt-6 sm:mt-8 flex items-center gap-6 text-xs sm:text-sm font-bold text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary icon-glow" />
                  <span>Garantía Total</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary icon-glow" />
                  <span>Atención VIP</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mt-6 lg:mt-0 max-w-[260px] sm:max-w-[280px] lg:max-w-[320px] mx-auto w-full"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-primary/10 rounded-[2.5rem] blur-3xl -z-10" />
              
              {/* Glassmorphic Frame matching user screenshot */}
              <div className="relative bg-[#12141a]/90 backdrop-blur-xl border border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.9)] rounded-[2.2rem] lg:rounded-[2.5rem] p-2 overflow-hidden">
                <div className="w-full aspect-[9/16] rounded-[1.8rem] lg:rounded-[2rem] overflow-hidden bg-black relative flex items-center justify-center">
                  {isDirectVideoUrl(config.HERO_REEL_URL) ? (
                    <video 
                      src={config.HERO_REEL_URL}
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      preload="auto"
                      controls={false}
                      className="w-full h-full object-cover rounded-[1.8rem] lg:rounded-[2rem]"
                    />
                  ) : (
                    <div className="w-full h-full overflow-hidden relative rounded-[1.8rem] lg:rounded-[2rem] bg-black flex items-center justify-center">
                      <iframe 
                        src={getInstagramEmbedUrl(config.HERO_REEL_URL)}
                        className="w-[118%] h-[132%] border-0 rounded-[1.8rem] lg:rounded-[2rem] pointer-events-auto shrink-0"
                        style={{
                          transform: 'scale(1.22)',
                          transformOrigin: 'center 85%',
                          marginTop: '40%'
                        }}
                        allowTransparency={true}
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        scrolling="no"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="MasterTech Reel"
                      />
                      {/* Dark Gradient Overlay covering any bottom white card */}
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none z-10" />
                      {/* Overlay "Ver más en Instagram" button */}
                      <a 
                        href={config.HERO_REEL_URL} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/90 hover:bg-black backdrop-blur-md text-white border border-white/20 text-[11px] font-bold px-3.5 py-1.5 rounded-full z-20 flex items-center gap-1.5 transition-all shadow-xl hover:scale-105 whitespace-nowrap"
                      >
                        <Instagram size={14} className="text-pink-500" />
                        <span>Ver más en Instagram</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brands Ticker */}
      <section className="py-6 bg-black/40 border-y border-white/5 relative overflow-hidden flex items-center">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0d0e12] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0d0e12] to-transparent z-10 pointer-events-none" />
        
        <div className="animate-marquee gap-16 px-8 items-center">
          {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
            <div key={i} className="text-2xl md:text-3xl font-display font-black text-white/10 uppercase tracking-widest hover:text-primary/80 transition-colors duration-500 whitespace-nowrap cursor-default">
              {brand}
            </div>
          ))}
        </div>
      </section>



      {/* Instalaciones Section */}
      <section id="instalaciones" className="py-32 px-6 bg-[#0a0b0f] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1">
              <h2 className="text-5xl lg:text-7xl font-display font-black tracking-tighter mb-8">NUESTRAS <br/><span className="text-primary italic">INSTALACIONES</span></h2>
              <div className="space-y-8">
                {[
                  { title: "Área de Recepción", desc: "Atención al cliente personalizada y elaboración de presupuestos transparentes.", icon: <User className="w-6 h-6 text-primary icon-glow" /> },
                  { title: "Sala de Espera VIP", desc: "Zona cómoda y climatizada con café de cortesía y conexión Wi-Fi de alta velocidad.", icon: <Clock className="w-6 h-6 text-primary icon-glow" /> },
                  { title: "Almacén de Repuestos", desc: "Amplio stock de filtros, aceites, bujías y consumibles comunes para agilizar tu servicio.", icon: <Award className="w-6 h-6 text-primary icon-glow" /> },
                  { title: "Software de Gestión", desc: "Control de inventario, órdenes de trabajo e historial detallado de tu vehículo.", icon: <Search className="w-6 h-6 text-primary icon-glow" /> }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="mt-1 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-black mb-2">{item.title}</h3>
                      <p className="text-zinc-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="glass-card p-2 md:p-4 rotate-3 hover:rotate-0 transition-transform duration-500">
                 <img src={config.IMG_INSTALACIONES || "/assets/instalaciones.jpg"} alt="Instalaciones MasterTech" className="rounded-2xl w-full object-cover aspect-[4/3] grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
            </div>
          </div>
        </div>
      </section>





      {/* Booking Form */}
      <section id="contacto" className="py-16 md:py-32 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-4 sm:p-8 md:p-16 lg:p-20 relative overflow-hidden mt-8 md:mt-16">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full -mr-48 -mt-48 pointer-events-none" />
            
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 relative z-10">
              <div>
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-display font-black tracking-tighter mb-4 md:mb-8 leading-none">RESERVA TU <br /><span className="text-primary italic">CUPO</span></h2>
                <p className="text-base sm:text-xl text-zinc-400 mb-8 md:mb-12 leading-relaxed">Estamos listos para recibirte. Completa los datos y te asignaremos un técnico especialista.</p>
                
                <div className="space-y-6 md:space-y-8">
                  <a 
                    href={config.WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 sm:gap-6 group cursor-pointer"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                      <Phone size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">WhatsApp Directo</p>
                      <p className="text-base sm:text-xl font-black text-white truncate">{config.PHONE_NUMBER}</p>
                    </div>
                  </a>
                  <a 
                    href={config.GOOGLE_MAPS_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 sm:gap-6 group cursor-pointer"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                      <MapPin size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Ubicación</p>
                      <p className="text-base sm:text-xl font-black text-white truncate">Porlamar, Nueva Esparta</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="bg-white/5 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/10">
                {formStatus === 'success' ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 sm:py-20">
                    <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mx-auto mb-6" />
                    <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter mb-4">¡CITA SOLICITADA!</h3>
                    {selectedService === 'Línea de inspección gratuita' ? (
                      <>
                        <div className="inline-block bg-primary/20 border border-primary text-primary px-4 py-2 rounded-full font-bold tracking-widest text-xs sm:text-sm mb-6 animate-pulse">
                          {(config.SUCCESS_BADGE && !config.SUCCESS_BADGE.includes('30%')) ? config.SUCCESS_BADGE : '¡TIENES HASTA UN 15% DE DESCUENTO!'}
                        </div>
                        <p className="text-zinc-400 text-sm sm:text-base">{config.SUCCESS_TEXT || 'Un técnico especialista se comunicará contigo vía WhatsApp en breve para coordinar tu descuento y cita.'}</p>
                      </>
                    ) : (
                      <p className="text-zinc-400 text-base sm:text-lg">Tu solicitud ha sido registrada con éxito. <br/><br/> Un asesor de servicio te contactará de inmediato por WhatsApp para confirmar tu cita.</p>
                    )}
                    <button onClick={() => setFormStatus('idle')} className="mt-8 text-primary font-bold uppercase tracking-widest text-xs hover:underline">Solicitar otra cita</button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="lead-form-nombre" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2 sm:ml-4">Nombre</label>
                        <input id="lead-form-nombre" required name="nombre" type="text" placeholder="Tu Nombre" className="w-full bg-black/40 border border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 px-4 sm:px-6 focus:border-primary outline-none transition-all placeholder:text-zinc-700 text-sm text-white" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lead-form-telefono" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2 sm:ml-4">Teléfono</label>
                        <input id="lead-form-telefono" required name="telefono" type="tel" placeholder="0412 000 0000" className="w-full bg-black/40 border border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 px-4 sm:px-6 focus:border-primary outline-none transition-all placeholder:text-zinc-700 text-sm text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="lead-form-vehiculo" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2 sm:ml-4">Vehículo</label>
                      <div className="relative">
                        <Car className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-zinc-600" />
                        <input id="lead-form-vehiculo" required name="vehiculo" type="text" placeholder="Ej: Toyota Hilux 2022" className="w-full bg-black/40 border border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-11 sm:pl-14 pr-4 sm:pr-6 focus:border-primary outline-none transition-all placeholder:text-zinc-700 text-sm text-white" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="lead-form-servicio" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2 sm:ml-4">Servicio Requerido</label>
                      <select 
                        id="lead-form-servicio"
                        name="servicio" 
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 px-4 sm:px-6 focus:border-primary outline-none transition-all appearance-none cursor-pointer text-white text-sm"
                      >
                        <option value="Línea de inspección gratuita">Línea de inspección gratuita</option>
                        {services.map((s, idx) => (
                          <option key={s.id || idx} value={s.title}>{s.title}</option>
                        ))}
                        <option value="Otro">Otro (Especificar)</option>
                      </select>
                    </div>

                    {selectedService === 'Línea de inspección gratuita' && (
                      <InspectionSlotPicker 
                        onSelectSlot={(slotStr, isValid) => {
                          setInspectionSlotStr(slotStr);
                          setIsInspectionSlotValid(isValid);
                        }} 
                      />
                    )}

                    <div className="space-y-2">
                      <label htmlFor="lead-form-falla" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2 sm:ml-4">Descripción o Falla del Vehículo</label>
                      <textarea 
                        id="lead-form-falla"
                        name="falla" 
                        placeholder="Describe la falla, ruido o lo que deseas realizarle a tu vehículo..." 
                        rows={2} 
                        className="w-full bg-black/40 border border-white/10 rounded-xl sm:rounded-2xl py-3 px-4 sm:px-6 focus:border-primary outline-none transition-all text-sm resize-none text-white placeholder:text-zinc-700" 
                      />
                    </div>

                    <button disabled={formStatus === 'loading'} type="submit" className="btn-primary w-full !py-4 sm:!py-5 shadow-[0_20px_50px_rgba(229,57,53,0.3)] text-xs sm:text-sm font-black tracking-wider">
                      {formStatus === 'loading' ? 'Procesando...' : 'AGENDAR MI CITA VÍA WHATSAPP'}
                    </button>
                    {formStatus === 'error' && (
                      <p className="text-primary text-center text-sm font-bold pt-2">{formErrorMessage}</p>
                    )}
                    <p className="text-[11px] sm:text-xs text-center text-zinc-500 leading-relaxed font-medium pt-1 sm:pt-2">Una vez enviado, un asesor de servicio te contactará de inmediato por WhatsApp para confirmar tu hora exacta. ¡Te esperamos con el café listo! ☕</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-[#0a0b0f] border-t border-white/5 pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-20 mb-24">
            <div className="lg:col-span-2">
              <div className="flex items-center mb-8">
                <img src={config.LOGO_URL} alt="MasterTech" className="h-10 w-auto" />
              </div>
              <p className="text-zinc-500 text-lg max-w-sm mb-10 leading-relaxed">
                Elevando el estándar del servicio automotriz en el Caribe. Tecnología, pasión y resultados garantizados.
              </p>
              <div className="flex gap-4">
                <a 
                  href={config.INSTAGRAM_LINK || "https://www.instagram.com/tallermastertech/"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-all group"
                  title="Instagram"
                >
                  <Instagram size={20} className="group-hover:scale-110 transition-transform text-white" />
                </a>
                <a 
                  href={config.TIKTOK_LINK || "https://www.tiktok.com/@tallermastertech"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-all group"
                  title="TikTok"
                >
                  <TikTokIcon size={20} className="group-hover:scale-110 transition-transform text-white" />
                </a>
                <a 
                  href={config.YOUTUBE_LINK || "https://www.youtube.com/@tallermastertech"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-all group"
                  title="YouTube"
                >
                  <Youtube size={20} className="group-hover:scale-110 transition-transform text-white" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-8">Servicios</h4>
              <ul className="space-y-4 text-zinc-400 font-bold text-sm">
                <li><a href="/servicios" className="hover:text-primary transition-colors">Mecánica General</a></li>
                <li><a href="/servicios" className="hover:text-primary transition-colors">Mantenimiento Preventivo</a></li>
                <li><a href="/servicios" className="hover:text-primary transition-colors">Electricidad y Electrónica</a></li>
                <li><a href="/servicios" className="hover:text-primary transition-colors">Frenos y Suspensión</a></li>
                <li><a href="/servicios" className="hover:text-primary transition-colors">Inyección Electrónica</a></li>
                <li><a href="/servicios" className="hover:text-primary transition-colors">Climatización</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-8">Contacto</h4>
              <ul className="space-y-6 text-zinc-400 text-sm">
                <li>
                  <a 
                    href={config.GOOGLE_MAPS_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 hover:text-white transition-colors"
                  >
                    <MapPin className="text-primary shrink-0" />
                    <span>Sector Sucre, Calle Principal, Nueva Esparta.</span>
                  </a>
                </li>
                <li>
                  <a 
                    href={config.WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 hover:text-white transition-colors"
                  >
                    <Phone className="text-primary shrink-0" />
                    <span>{config.PHONE_NUMBER}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>



          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
            <p>© 2026 MASTERTECH AUTOMOTRIZ. Isla de Margarita, Venezuela.</p>
            <div className="flex gap-12">
              <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
              <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Global CSS for custom styles */}
      <style>{`
        .text-outline {
          color: transparent;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
