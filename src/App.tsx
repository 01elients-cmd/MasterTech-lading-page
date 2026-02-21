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
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- CONFIGURACIÓN REAL ---
const CONFIG = {
  PHONE_NUMBER: "+584123565012", 
  WHATSAPP_LINK: "https://wa.link/xnj37f", 
  WEBHOOK_URL: "https://script.google.com/macros/s/AKfycbxIzUm7itb1hP8BCfbt3tWThExU_jBM9h_-kxJbGb7TlMryGA-zc01OmRnoAASU5AOM/exec", 
  GOOGLE_MAPS_LINK: "https://maps.app.goo.gl/uTNBRvUcd7HVRoFF9",
  GOOGLE_MAPS_EMBED: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.446344738464!2d-63.856644!3d10.954321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDU3JzE1LjYiTiA2M8KwNTEnMjMuOSJX!5e0!3m2!1ses!2sve!4v1700000000000!5m2!1ses!2sve",
  GOOGLE_BUSINESS_URL: "https://maps.app.goo.gl/uTNBRvUcd7HVRoFF9",
  HERO_IMG: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1920",
  LOGO_URL: "https://i.postimg.cc/8PdvRL6h/logo.png", 
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('loading');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      console.log("Enviando datos:", data);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormStatus('success');
    } catch (error) {
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen selection:bg-primary selection:text-white">
      {/* Botón WhatsApp Flotante */}
      <a 
        href={CONFIG.WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] p-4 rounded-full shadow-2xl hover:scale-110 transition-transform animate-float flex items-center justify-center"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-8 h-8 text-white fill-current" />
      </a>

      {/* Header */}
      <nav className={`fixed w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-md py-4 border-b border-white/10' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src={CONFIG.LOGO_URL} 
              alt="MasterTech Logo" 
              className="h-10 w-auto object-contain" 
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-2xl font-display font-bold tracking-tighter">MASTER<span className="text-primary">TECH</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#servicios" className="text-sm font-medium hover:text-primary transition-colors">Servicios</a>
            <a href="#proceso" className="text-sm font-medium hover:text-primary transition-colors">Proceso</a>
            <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">FAQ</a>
            <a href="#contacto" className="btn-primary !py-2 !px-6 text-sm">Reservar Cita</a>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#0a0a0a] pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-center">
              <a href="#servicios" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">Servicios</a>
              <a href="#proceso" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">Proceso</a>
              <a href="#faq" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">FAQ</a>
              <a href="#contacto" onClick={() => setIsMenuOpen(false)} className="btn-primary">Reservar Ahora</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={CONFIG.HERO_IMG} 
            alt="Taller mecánico especializado 4x4" 
            className="w-full h-full object-cover opacity-40"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <Award className="w-4 h-4" /> Especialistas en Jeep & 4x4
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold leading-[0.9] mb-6">
              Diagnóstico <span className="text-primary">Profesional</span> para tu 4x4.
            </h1>
            <p className="text-lg text-zinc-400 mb-8 max-w-lg">
              En MasterTech cuidamos tu inversión con tecnología de punta y garantía certificada. Especialistas en Sucre, Nueva Esparta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={CONFIG.WHATSAPP_LINK} className="btn-primary">
                <MessageCircle className="w-5 h-5" /> Agendar por WhatsApp
              </a>
              <a href="#contacto" className="btn-secondary">
                Ver Oferta Especial
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block relative"
          >
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
            <div className="glass-card p-8 relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] bg-zinc-800 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Cliente" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex text-yellow-500">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="font-bold">+500 Clientes Satisfechos</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle2 className="text-primary w-5 h-5" />
                  <span>Garantía en repuestos y mano de obra</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle2 className="text-primary w-5 h-5" />
                  <span>Entrega rápida y puntual</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle2 className="text-primary w-5 h-5" />
                  <span>Comunicación directa vía WhatsApp</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problema y Solución */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl mb-8 italic font-light">
            "¿Cansado de diagnósticos erróneos que solo te hacen perder tiempo y dinero?"
          </h2>
          <p className="text-xl text-zinc-400 leading-relaxed">
            En MasterTech entendemos que tu vehículo es tu herramienta de libertad. Por eso, combinamos **experiencia técnica real** con **equipos de diagnóstico avanzados** para resolver problemas complejos en la primera visita.
          </p>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl mb-4">Servicios <span className="text-primary">Destacados</span></h2>
            <p className="text-zinc-500">Soluciones integrales para mantener tu 4x4 en la ruta.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <Search />, title: "Diagnóstico Computarizado", desc: "Escaneo profundo de sistemas electrónicos y motor." },
              { icon: <Wrench />, title: "Mecánica Especializada", desc: "Reparación de motores, transmisiones y diferenciales." },
              { icon: <ShieldCheck />, title: "Especialidad 4x4 & Jeep", desc: "Expertos en Cherokee, suspensiones y sistemas de tracción." },
              { icon: <Zap />, title: "Mantenimiento Preventivo", desc: "Cambio de aceite, filtros y revisión de seguridad total." }
            ].map((s, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="glass-card p-8 hover:bg-white/10 transition-colors"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                  {React.cloneElement(s.icon as React.ReactElement, { className: "w-8 h-8" })}
                </div>
                <h3 className="text-xl mb-3">{s.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prueba Social */}
      <section className="py-24 bg-primary/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="text-4xl md:text-6xl mb-4">Confianza <span className="text-primary">Real</span></h2>
              <p className="text-zinc-500">Lo que dicen los dueños de 4x4 en Sucre.</p>
            </div>
            <div className="flex items-center gap-4 glass-card px-6 py-4">
              <div className="text-right">
                <div className="flex text-yellow-500 justify-end">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm font-bold">4.9/5 en Google Business</p>
              </div>
              <a href={CONFIG.GOOGLE_BUSINESS_URL} target="_blank" rel="noopener" className="text-primary hover:underline font-bold">Ver reseñas</a>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Carlos M.", city: "Sucre", text: "Excelente atención para mi Cherokee. Detectaron una falla eléctrica que nadie más pudo solucionar.", service: "Diagnóstico Eléctrico" },
              { name: "Elena R.", city: "Porlamar", text: "Rapidez y honestidad. Me explicaron todo el proceso y la garantía me dio mucha tranquilidad.", service: "Mantenimiento General" },
              { name: "Jorge V.", city: "Sucre", text: "El mejor taller para 4x4 en la zona. Mi camioneta quedó perfecta para el off-road.", service: "Suspensión & Tracción" }
            ].map((t, i) => (
              <div key={i} className="glass-card p-8 relative">
                <Star className="absolute top-8 right-8 text-primary/20 w-12 h-12" />
                <p className="text-zinc-300 mb-6 italic">"{t.text}"</p>
                <div>
                  <p className="font-bold text-lg">{t.name}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">{t.city} • {t.service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section id="proceso" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl mb-4">Tu cita en <span className="text-primary">3 pasos</span></h2>
            <p className="text-zinc-500">Sin complicaciones, directo al grano.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Agenda", desc: "Escríbenos por WhatsApp o llena el formulario con tus datos.", time: "2 min" },
              { step: "02", title: "Diagnóstico", desc: "Trae tu vehículo para una revisión técnica exhaustiva.", time: "45 min" },
              { step: "03", title: "Reparación", desc: "Aprobamos presupuesto y trabajamos con garantía total.", time: "Varía" }
            ].map((p, i) => (
              <div key={i} className="text-center group">
                <div className="text-8xl font-display font-black text-white/5 mb-[-40px] group-hover:text-primary/10 transition-colors">{p.step}</div>
                <h3 className="text-2xl mb-4 relative z-10">{p.title}</h3>
                <p className="text-zinc-500 mb-4">{p.desc}</p>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Est. {p.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Oferta */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-primary rounded-[2rem] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32" />
          <h2 className="text-4xl md:text-6xl font-black mb-6">¡10% DE DESCUENTO!</h2>
          <p className="text-2xl mb-8 font-medium">En tu primera visita de mantenimiento preventivo.</p>
          <a href={CONFIG.WHATSAPP_LINK} className="bg-white text-primary px-12 py-5 rounded-full font-black text-xl hover:bg-zinc-100 transition-colors inline-flex items-center gap-3">
            RECLAMAR OFERTA <ChevronRight />
          </a>
          <p className="mt-6 text-sm opacity-80">*Válido solo para nuevos clientes en Sucre.</p>
        </div>
      </section>

      {/* Formulario */}
      <section id="contacto" className="py-24 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-4xl md:text-6xl mb-8">Reserva tu <span className="text-primary">Cita</span></h2>
            <p className="text-xl text-zinc-400 mb-12">
              Completa el formulario y un técnico se pondrá en contacto contigo en menos de 30 minutos (en horario laboral).
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-primary">
                  <Phone />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 uppercase tracking-widest">Llámanos</p>
                  <p className="text-xl font-bold">+58 412 000 0000</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-primary">
                  <MapPin />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 uppercase tracking-widest">Ubicación</p>
                  <p className="text-xl font-bold">Sucre, Edo. Nueva Esparta</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-10">
            {formStatus === 'success' ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h3 className="text-3xl font-bold mb-4">¡Solicitud Enviada!</h3>
                <p className="text-zinc-400">Nos comunicaremos contigo muy pronto.</p>
                <button onClick={() => setFormStatus('idle')} className="mt-8 text-primary hover:underline">Enviar otra solicitud</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Nombre</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input required name="nombre" type="text" placeholder="Tu nombre" className="w-full bg-zinc-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-primary outline-none transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input required name="telefono" type="tel" placeholder="0412..." className="w-full bg-zinc-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-primary outline-none transition-colors" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Vehículo (Marca/Modelo)</label>
                  <div className="relative">
                    <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input required name="vehiculo" type="text" placeholder="Ej: Jeep Cherokee 2015" className="w-full bg-zinc-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-primary outline-none transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Servicio</label>
                    <div className="relative">
                      <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <select name="servicio" className="w-full bg-zinc-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-primary outline-none transition-colors appearance-none">
                        <option>Diagnóstico</option>
                        <option>Mantenimiento</option>
                        <option>Reparación 4x4</option>
                        <option>Otro</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Fecha Preferida</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input name="fecha" type="date" className="w-full bg-zinc-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-primary outline-none transition-colors" />
                    </div>
                  </div>
                </div>

                <button 
                  disabled={formStatus === 'loading'}
                  type="submit" 
                  className="btn-primary w-full !rounded-xl"
                >
                  {formStatus === 'loading' ? 'Enviando...' : 'Solicitar Cita Ahora'}
                </button>
                <p className="text-[10px] text-center text-zinc-600 uppercase tracking-widest">Al enviar, aceptas ser contactado por MasterTech vía WhatsApp.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl text-center mb-16">Preguntas <span className="text-primary">Frecuentes</span></h2>
          <div className="space-y-4">
            {[
              { q: "¿Tienen garantía en los trabajos?", a: "Sí, ofrecemos garantía certificada de 3 meses en mano de obra y la garantía del fabricante en repuestos originales." },
              { q: "¿Especialistas solo en Jeep?", a: "Somos expertos en Jeep Cherokee, pero atendemos todas las marcas de vehículos 4x4 y SUV con equipos multimarca de última generación." },
              { q: "¿Cuánto tarda un diagnóstico?", a: "Un escaneo y revisión física básica toma aproximadamente 45 a 60 minutos. Te entregamos un reporte detallado." },
              { q: "¿Debo pedir cita previa?", a: "Es recomendable para garantizarte atención inmediata, pero también recibimos emergencias según disponibilidad." },
              { q: "¿Dónde están ubicados exactamente?", a: "Estamos en Sucre, Estado Nueva Esparta. Al agendar te enviamos la ubicación exacta por WhatsApp." }
            ].map((item, i) => (
              <details key={i} className="glass-card group">
                <summary className="p-6 cursor-pointer font-bold flex justify-between items-center list-none">
                  {item.q}
                  <ChevronDown className="group-open:rotate-180 transition-transform text-primary" />
                </summary>
                <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-white/10 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={CONFIG.LOGO_URL} 
                alt="MasterTech Logo" 
                className="h-8 w-auto object-contain" 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="text-xl font-display font-bold">MASTER<span className="text-primary">TECH</span></span>
            </div>
            <p className="text-zinc-500 max-w-sm mb-8">
              Líderes en diagnóstico y reparación automotriz en Sucre. Tu confianza es nuestro motor.
            </p>
            <div className="flex gap-4">
              <a href={CONFIG.WHATSAPP_LINK} target="_blank" rel="noopener" className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-primary transition-colors"><MessageCircle className="w-5 h-5" /></a>
              <a href={CONFIG.GOOGLE_MAPS_LINK} target="_blank" rel="noopener" className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-primary transition-colors"><MapPin className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-zinc-500">Horario</h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li className="flex justify-between"><span>Lun - Vie:</span> <span>8:00 - 17:00</span></li>
              <li className="flex justify-between"><span>Sábados:</span> <span>8:00 - 13:00</span></li>
              <li className="flex justify-between text-primary font-bold"><span>Domingos:</span> <span>Cerrado</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-zinc-500">Contacto</h4>
            <ul className="space-y-4 text-zinc-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-primary w-5 h-5 shrink-0" />
                <a href={CONFIG.GOOGLE_MAPS_LINK} target="_blank" rel="noopener" className="hover:text-white transition-colors">Sector Sucre, Calle Principal, Nueva Esparta, Venezuela.</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-primary w-5 h-5 shrink-0" />
                <span>+58 412 000 0000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto h-[300px] rounded-2xl overflow-hidden mb-16 border border-white/10">
          <iframe 
            src={CONFIG.GOOGLE_MAPS_EMBED}
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-zinc-600 font-bold uppercase tracking-widest">
          <p>© 2024 MasterTech Sucre. Todos los derechos reservados.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
