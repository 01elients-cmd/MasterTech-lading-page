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
  Minus
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
  
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedService, setSelectedService] = useState('Diagnóstico Electrónico');

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

      {/* FAQ Section */}
      <section id="faq" className="py-32 px-6">
        <div className="max-w-3xl mx-auto mt-16">
          <div className="text-center mb-16">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4 block">Resolviendo tus Dudas</span>
            <h2 className="text-5xl lg:text-7xl font-display font-black leading-none tracking-tighter">
              PREGUNTAS <br />
              <span className="text-primary italic">FRECUENTES</span>
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "¿Cuánto tiempo toma el diagnóstico electrónico?", a: "Nuestro diagnóstico profundo suele tomar entre 45 minutos y 1 hora. Entregamos un reporte detallado con código de fallas y plan de acción." },
              { q: "¿Qué incluye la Línea de Inspección Gratuita?", a: "Es una revisión visual de 20 puntos de seguridad, líquidos, frenos, tren delantero y batería. Ideal para conocer el estado general antes de un viaje." },
              { q: "¿Trabajan con todas las marcas de vehículos?", a: "Somos especialistas certificados en marcas Americanas y Japonesas (Toyota, Ford, Chevrolet, Honda, Jeep, etc.)." },
              { q: "¿Ofrecen garantía por los trabajos realizados?", a: "Sí, todos nuestros trabajos de mecánica mayor cuentan con una garantía certificada de 3 meses, siempre y cuando se utilicen repuestos originales recomendados por nuestro equipo." }
            ].map((faq, i) => (
              <div 
                key={i} 
                className={`glass-card overflow-hidden transition-all duration-300 border ${openFaq === i ? 'border-primary/50' : 'border-white/5 hover:border-white/10'}`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                >
                  <span className="font-bold text-lg text-white">{faq.q}</span>
                  {openFaq === i ? <Minus className="text-primary shrink-0" /> : <Plus className="text-zinc-500 shrink-0" />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="px-6 pb-6 text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
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
                      <select 
                        name="servicio" 
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 focus:border-primary outline-none transition-all appearance-none cursor-pointer text-white"
                      >
                        <option>Diagnóstico Electrónico</option>
                        <option>Mantenimiento Preventivo</option>
                        <option>Mecánica Especializada</option>
                        <option>Línea de Inspección</option>
                        <option>Otro</option>
                      </select>
                    </div>

                    <AnimatePresence>
                      {selectedService === 'Línea de Inspección' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-4 overflow-hidden border border-primary/20 bg-primary/5 p-6 rounded-3xl"
                        >
                          <div className="flex items-center gap-2 mb-2 text-primary font-bold uppercase tracking-widest text-[10px]">
                            <Car className="w-4 h-4" /> Datos de Inspección
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Placa</label>
                              <input required name="placa" type="text" placeholder="Ej: AA11BB" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:border-primary outline-none transition-all text-sm uppercase text-white" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Año</label>
                              <input required name="año" type="number" placeholder="2022" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:border-primary outline-none transition-all text-sm text-white" />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Ubicación Actual</label>
                            <input required name="ubicacion" type="text" placeholder="¿Dónde se encuentra el vehículo?" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:border-primary outline-none transition-all text-sm text-white" />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Falla Principal (Breve)</label>
                            <textarea required name="falla" placeholder="Describa el sonido, falla o luz en el tablero..." rows={2} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:border-primary outline-none transition-all text-sm resize-none text-white" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

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
