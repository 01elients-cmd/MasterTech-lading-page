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
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AdminPanel from './AdminPanel';

// --- CONFIGURACIÓN ---
const CONFIG = {
  PHONE_NUMBER: "+584123565012", 
  WHATSAPP_LINK: "https://wa.link/xnj37f", 
  WEBHOOK_URL: "https://script.google.com/macros/s/AKfycbxIzUm7itb1hP8BCfbt3tWThExU_jBM9h_-kxJbGb7TlMryGA-zc01OmRnoAASU5AOM/exec", 
  GOOGLE_MAPS_LINK: "https://maps.app.goo.gl/fybS1jW9buxQD5gv7",
  GOOGLE_MAPS_EMBED: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15665.5!2d-63.8681155!3d10.9701683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c318fe358d81b01%3A0xf0c67c88a5063093!2sTaller%20MasterTech!5e0!3m2!1ses!2sve!4v1700000000000!5m2!1ses!2sve",
  GOOGLE_BUSINESS_URL: "https://maps.app.goo.gl/fybS1jW9buxQD5gv7",
  HERO_IMG: "/assets/hero_bg.png",
  LOGO_URL: "/logo.png", 
  BEFORE_AFTER_1: "/assets/before_after_1.png",
  BEFORE_AFTER_2: "/assets/before_after_2.png",
};

const BRANDS = [
  "Toyota", "Jeep", "Ford", "Chevrolet", "Nissan", "Mitsubishi", "Dodge", "Honda"
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState(0);

  // Dynamic config initialized with static CONFIG fallback
  const [config, setConfig] = useState(CONFIG);
  const [isAdmin, setIsAdmin] = useState(
    window.location.pathname === '/admin' || window.location.hash === '#admin'
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Dynamic settings loader
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setConfig(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Error cargando configuración dinámica:", err);
      }
    };
    fetchSettings();

    // Internal router listener
    const handleHashChange = () => {
      setIsAdmin(window.location.pathname === '/admin' || window.location.hash === '#admin');
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
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setFormStatus('success');
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      console.error("Error enviando formulario:", error);
      setFormStatus('error');
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

  return (
    <div className={`min-h-screen selection:bg-primary selection:text-white bg-[#0a0a0a] ${config.BANNER_TEXT ? 'pt-8 md:pt-9' : ''}`}>
      {config.BANNER_TEXT && (
        <div className="bg-primary text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] py-2 px-4 text-center fixed top-0 w-full z-[60] border-b border-white/5 h-8 md:h-9 flex items-center justify-center">
          {config.BANNER_TEXT}
        </div>
      )}

      {/* WhatsApp Button */}
      <a 
        href={config.WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] p-4 rounded-full shadow-2xl hover:scale-110 transition-transform animate-float flex items-center justify-center group"
      >
        <span className="absolute right-full mr-3 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">¡Escríbenos ahora!</span>
        <MessageCircle className="w-8 h-8 text-white fill-current" />
      </a>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${config.BANNER_TEXT ? 'top-8 md:top-9' : 'top-0'} ${isScrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-xl py-3 border-b border-white/5' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <img src={config.LOGO_URL} alt="MasterTech" className="h-10 w-auto" />
            <span className="text-2xl font-display font-black tracking-tighter text-white">MASTER<span className="text-primary">TECH</span></span>
          </motion.div>

          <div className="hidden lg:flex items-center gap-10">
            {['Servicios', 'Antes & Después', 'Proceso', 'Contacto'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(/ & /g, '').replace(/ /g, '')}`} 
                className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </a>
            ))}
            <a href="#contacto" className="btn-primary !py-2 !px-8 text-xs border-none">Reserva Ahora</a>
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
            className="fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col items-center justify-center p-6 lg:hidden"
          >
            <div className="flex flex-col gap-8 text-center">
              {['Servicios', 'Antes & Después', 'Proceso', 'FAQ', 'Contacto'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(/ & /g, '').replace(/ /g, '')}`} 
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-4xl font-display font-black hover:text-primary transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 1.5 }}
            src={config.HERO_IMG} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-8">
                {config.IS_OPEN === 'true' ? (
                  <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Abierto Ahora
                  </span>
                ) : (
                  <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    <span className="relative flex h-2 w-2">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                    </span>
                    Cerrado (Llámanos)
                  </span>
                )}

                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Tecnología Certificada</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-display font-black leading-[0.9] mb-8 tracking-tighter uppercase">
                TU VEHÍCULO NO NECESITA ADIVINANZAS,<br />
                <span className="text-primary">NECESITA UN DIAGNÓSTICO</span> <span className="text-outline">REAL.</span>
              </h1>
              
              <p className="text-xl text-zinc-400 mb-12 max-w-xl leading-relaxed">
                No vendemos humo ni promesas. Somos el centro técnico más transparente de la isla. Especialistas en vehículos Japoneses y Americanos. Mecánica sin cajas negras.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <a href={config.WHATSAPP_LINK} className="btn-primary">
                  Agendar Diagnóstico al WhatsApp <ArrowRight className="w-5 h-5" />
                </a>
                <a href="#antesydespués" className="btn-secondary group">
                  Ver Proyectos <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </a>
              </div>

              <div className="mt-16 flex items-center gap-8 border-t border-white/5 pt-8">
                <div>
                  <p className="text-2xl font-black text-white">+500</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Carros Restaurados</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-2xl font-black text-white">4.9/5</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Rating Google</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-2xl font-black text-white">3 Meses</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Garantía Total</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden lg:block relative"
            >
              <div className="glass-card p-1 overflow-hidden">
                <img src="/assets/before_after_1.png" alt="Featured Work" className="rounded-xl w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                  <div>
                    <h3 className="text-xl font-black mb-1 uppercase tracking-tight">Mecánica Transparente</h3>
                    <p className="text-zinc-400 text-sm">Diagnóstico profundo y cero cajas negras.</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Marquee */}
      <section className="py-12 border-y border-white/5 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <span key={i} className="text-4xl lg:text-6xl font-display font-black mx-12 text-zinc-800 hover:text-primary transition-colors cursor-default uppercase italic tracking-tighter">
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4 block">Excelencia Técnica</span>
              <h2 className="text-5xl lg:text-7xl font-display font-black leading-none tracking-tighter">
                SOLUCIONES TÉCNICAS. <br />
                <span className="text-primary italic">SIN EXCUSAS.</span>
              </h2>
            </div>
            <p className="text-zinc-500 lg:max-w-xs text-right text-sm leading-relaxed">
              Equipamiento avanzado con la transparencia técnica que tu vehículo exige.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Search />, title: "Escaneo", desc: "Diagnóstico computarizado profundo para detectar la raíz exacta del problema.", color: "red" },
              { icon: <Activity />, title: "Inyección", desc: "Limpieza por ultrasonido y calibración precisa de inyectores.", color: "zinc" },
              { icon: <Wrench />, title: "Mecánica", desc: "Cirugía mecánica mayor, armado con torque específico y repuestos certificados.", color: "red" },
              { icon: <ShieldCheck />, title: "Mantenimiento", desc: "Servicio preventivo real que alarga la vida útil de tu motor sin adivinanzas.", color: "zinc" }
            ].map((s, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="glass-card p-10 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  {React.cloneElement(s.icon as React.ReactElement, { size: 100 })}
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${s.color === 'red' ? 'bg-primary text-white' : 'bg-white/10 text-primary'}`}>
                  {React.cloneElement(s.icon as React.ReactElement, { size: 28 })}
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{s.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">{s.desc}</p>
                <a href="#contacto" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary group-hover:gap-4 transition-all">
                  Saber Más <ChevronRight size={16} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Gallery */}
      <section id="antesydespués" className="py-32 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-7xl font-display font-black tracking-tighter mb-6">
              LO QUE VES, <span className="text-primary italic">ES LO QUE ENTREGAMOS</span>
            </h2>
            <div className="flex justify-center gap-4">
              {['Motores', 'Estética', 'Suspensión'].map((tab, i) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(i)}
                  className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === i ? 'bg-primary text-white' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 h-[500px]">
            <motion.div 
              key={`img-${activeTab}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-[2rem] overflow-hidden group"
            >
              <img 
                src={activeTab === 0 ? config.BEFORE_AFTER_1 : config.BEFORE_AFTER_2} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest">
                Antes & Después
              </div>
            </motion.div>
            
            <div className="flex flex-col justify-center gap-8 lg:pl-12">
              <div className="space-y-6">
                <h3 className="text-4xl font-black italic tracking-tighter">"EL DETALLE NO ES UN LUJO"</h3>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  Nada de químicos mágicos ni pulituras engañosas para la foto. Desarmamos tu motor, limpiamos el carbón real de las piezas y armamos con repuestos certificados. El detalle no es un lujo, es nuestra forma de trabajar.
                </p>
                <ul className="space-y-4">
                  {[
                    "Limpieza por ultrasonido",
                    "Armado con torque específico",
                    "Diagnóstico computarizado",
                    "Repuestos certificados"
                  ].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white">
                      <CheckCircle2 className="text-primary w-5 h-5" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="proceso" className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4 block">Protocolo MasterTech</span>
            <h2 className="text-5xl lg:text-7xl font-display font-black leading-none tracking-tighter mb-12">
              CÓMO <br />
              <span className="text-primary">TRABAJAMOS</span>
            </h2>
            
            <div className="space-y-12">
              {[
                { step: "01", title: "Escaneo y Verdad", desc: "Metemos tu carro al box, documentamos el estado actual y pasamos el escáner a fondo." },
                { step: "02", title: "Diagnóstico en Video", desc: "No te mandamos un papel que no entiendes. Te enviamos un video directo a tu WhatsApp mostrando exactamente la pieza dañada y el presupuesto." },
                { step: "03", title: "Ejecución", desc: "Cirugía mecánica con la herramienta correcta." },
                { step: "04", title: "Prueba y Entrega", desc: "El carro no sale a la calle hasta que pasa la prueba de ruta." }
              ].map((item, i) => (
                <div key={i} className="flex gap-8 group">
                  <span className="text-4xl font-display font-black text-white/10 group-hover:text-primary/40 transition-colors">{item.step}</span>
                  <div>
                    <h4 className="text-xl font-black mb-2 uppercase tracking-tight">{item.title}</h4>
                    <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="absolute -inset-20 bg-primary/10 blur-[120px] rounded-full" />
            <div className="glass-card p-12 relative overflow-hidden">
              <div className="text-center space-y-8">
                <Clock className="w-20 h-20 text-primary mx-auto animate-pulse" />
                <h3 className="text-3xl font-black uppercase tracking-tighter">¿TIENES UNA EMERGENCIA?</h3>
                <p className="text-zinc-400">Si tu vehículo se quedó accidentado, ofrecemos servicio de grúa y diagnóstico prioritario.</p>
                <a href={config.WHATSAPP_LINK} className="btn-primary w-full">Llamar Ahora</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-primary/5 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-4xl lg:text-6xl font-display font-black tracking-tighter mb-6 italic">LA VOZ DE <br />LA RUTA</h2>
              <p className="text-zinc-500 mb-8">Nuestros clientes son los mejores embajadores de la calidad MasterTech.</p>
              <div className="flex items-center gap-4">
                <div className="flex text-yellow-500">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Google Verified</span>
              </div>
            </div>
            
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
              {[
                { source: "WhatsApp", img: "/assets/before_after_1.png" },
                { source: "Instagram", img: "/assets/before_after_2.png" }
              ].map((t, i) => (
                <div key={i} className="glass-card p-2 relative group hover:bg-white/10 transition-colors overflow-hidden h-[300px]">
                  <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-1 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest z-10">
                    Captura de {t.source}
                  </div>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-0" />
                  <img src={t.img} className="w-full h-full object-cover rounded-[1.2rem] opacity-50 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" alt="Testimonio" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="contacto" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-1 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full -mr-48 -mt-48" />
            
            <div className="grid lg:grid-cols-2 gap-20 relative z-10">
              <div>
                <h2 className="text-5xl lg:text-7xl font-display font-black tracking-tighter mb-8 leading-none">RESERVA TU <br /><span className="text-primary italic">BOX</span></h2>
                <p className="text-xl text-zinc-400 mb-12">Estamos listos para recibirte. Completa los datos y te asignaremos un técnico especialista.</p>
                
                <div className="space-y-8">
                  <div className="flex items-center gap-6 group">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">WhatsApp Directo</p>
                      <p className="text-xl font-black text-white">{config.PHONE_NUMBER}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 group">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Ubicación</p>
                      <p className="text-xl font-black text-white">Porlamar, Nueva Esparta</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                {formStatus === 'success' ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
                    <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">¡CITA SOLICITADA!</h3>
                    <p className="text-zinc-400">Un técnico especialista se comunicará contigo vía WhatsApp en breve.</p>
                    <button onClick={() => setFormStatus('idle')} className="mt-8 text-primary font-bold uppercase tracking-widest text-xs hover:underline">Solicitar otra cita</button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Nombre</label>
                        <input required name="nombre" type="text" placeholder="Tu Nombre" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 focus:border-primary outline-none transition-all placeholder:text-zinc-700" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Teléfono</label>
                        <input required name="telefono" type="tel" placeholder="0412 000 0000" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 focus:border-primary outline-none transition-all placeholder:text-zinc-700" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Vehículo</label>
                      <div className="relative">
                        <Car className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                        <input required name="vehiculo" type="text" placeholder="Ej: Toyota Hilux 2022" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:border-primary outline-none transition-all placeholder:text-zinc-700" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Servicio Requerido</label>
                      <select name="servicio" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                        <option>Diagnóstico Electrónico</option>
                        <option>Mantenimiento Preventivo</option>
                        <option>Mecánica Especializada</option>
                        <option>Línea de Inspección</option>
                        <option>Otro</option>
                      </select>
                    </div>

                    <button disabled={formStatus === 'loading'} type="submit" className="btn-primary w-full !py-5 shadow-[0_20px_50px_rgba(229,57,53,0.3)]">
                      {formStatus === 'loading' ? 'Procesando...' : 'CONFIRMAR DISPONIBILIDAD'}
                    </button>
                    <p className="text-[9px] text-center text-zinc-600 uppercase tracking-widest leading-relaxed">Al confirmar, aceptas ser contactado por nuestro equipo técnico especializado vía WhatsApp.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-white/5 pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-20 mb-24">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <img src={config.LOGO_URL} alt="MasterTech" className="h-10 w-auto" />
                <span className="text-3xl font-display font-black tracking-tighter">MASTER<span className="text-primary">TECH</span></span>
              </div>
              <p className="text-zinc-500 text-lg max-w-sm mb-10 leading-relaxed">
                Elevando el estándar del servicio automotriz en el Caribe. Tecnología, pasión y resultados garantizados.
              </p>
              <div className="flex gap-4">
                {[1,2,3].map(i => (
                  <a key={i} href="#" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-all group">
                    <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-8">Servicios</h4>
              <ul className="space-y-4 text-zinc-400 font-bold text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Diagnóstico 4x4</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Reparación Motores</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Suspensión Pro</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Frenos & ABS</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-8">Contacto</h4>
              <ul className="space-y-6 text-zinc-400 text-sm">
                <li className="flex gap-4">
                  <MapPin className="text-primary shrink-0" />
                  <span>Sector Sucre, Calle Principal, Nueva Esparta.</span>
                </li>
                <li className="flex gap-4">
                  <Phone className="text-primary shrink-0" />
                  <span>{config.PHONE_NUMBER}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="h-[400px] rounded-[3rem] overflow-hidden grayscale brightness-50 contrast-125 mb-24 border border-white/5 shadow-2xl">
            <iframe 
              src={config.GOOGLE_MAPS_EMBED}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
            />
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
