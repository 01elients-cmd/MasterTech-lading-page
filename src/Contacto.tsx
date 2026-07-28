import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Phone,
  Calendar,
  Car,
  MapPin,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CONFIG_DEFAULT = {
  PHONE_NUMBER: "+584123565012",
  WHATSAPP_LINK: "https://wa.link/xnj37f",
  WEBHOOK_URL: "https://script.google.com/macros/s/AKfycbxIzUm7itb1hP8BCfbt3tWThExU_jBM9h_-kxJbGb7TlMryGA-zc01OmRnoAASU5AOM/exec",
  GOOGLE_MAPS_LINK: "https://maps.app.goo.gl/fybS1jW9buxQD5gv7",
  LOGO_URL: "/logo.png",
  SUCCESS_BADGE: "¡TIENES UN 30% DE DESCUENTO!",
  SUCCESS_TEXT: "Un técnico especialista se comunicará contigo vía WhatsApp en breve para coordinar tu descuento y cita.",
};

export default function Contacto() {
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [selectedService, setSelectedService] = useState('Línea de inspección gratuita');
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
        // silently use defaults
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('loading');
    setFormErrorMessage('');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;
    data.servicio = selectedService === 'Otro' ? `Otro: ${data.falla}` : selectedService;

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setFormStatus('success');
      } else {
        const errorData = await res.json().catch(() => ({}));
        setFormErrorMessage(errorData.error || 'Error al procesar la solicitud.');
        setFormStatus('error');
      }
    } catch (error) {
      console.error("Error enviando formulario:", error);
      setFormErrorMessage('Error de conexión. Intenta de nuevo.');
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-primary selection:text-white flex flex-col">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/8 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <header className="py-5 px-6 flex justify-center border-b border-white/5 bg-[#0d0e12]/90 backdrop-blur-xl relative z-10">
        <img src={config.LOGO_URL} alt="MasterTech" className="h-10 w-auto" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16 relative z-10">
        <div className="w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Page Title */}
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 text-primary font-bold text-xs uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Agenda tu cita
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-black tracking-tighter leading-none mb-4">
                RESERVA TU <br />
                <span className="text-primary italic">CUPO</span>
              </h1>
              <p className="text-xl text-zinc-400 max-w-xl mx-auto">
                Estamos listos para recibirte. Completa los datos y te asignaremos un técnico especialista.
              </p>
            </div>

            {/* Card Grid */}
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Left: Contact Info */}
              <div className="lg:col-span-2 flex flex-col gap-6 justify-center">
                <a
                  href={config.WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 group p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-primary/40 hover:bg-white/8 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                    <Phone size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">WhatsApp Directo</p>
                    <p className="text-lg font-black text-white">{config.PHONE_NUMBER}</p>
                  </div>
                </a>

                <a
                  href={config.GOOGLE_MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 group p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-primary/40 hover:bg-white/8 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Ubicación</p>
                    <p className="text-lg font-black text-white">Porlamar, Nueva Esparta</p>
                  </div>
                </a>

                <a
                  href={config.WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 group p-6 bg-[#25D366]/10 border border-[#25D366]/20 rounded-3xl hover:border-[#25D366]/50 hover:bg-[#25D366]/15 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all shrink-0">
                    <MessageCircle size={22} className="fill-current" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Escríbenos ahora</p>
                    <p className="text-base font-black text-[#25D366]">Chat en WhatsApp</p>
                  </div>
                </a>
              </div>

              {/* Right: Booking Form */}
              <div className="lg:col-span-3 bg-white/5 p-8 rounded-3xl border border-white/10">
                <AnimatePresence mode="wait">
                  {formStatus === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-16"
                    >
                      <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                      <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">¡CITA SOLICITADA!</h2>
                      {selectedService === 'Línea de inspección gratuita' ? (
                        <>
                          <div className="inline-block bg-primary/20 border border-primary text-primary px-4 py-2 rounded-full font-bold tracking-widest text-sm mb-6 animate-pulse">
                            {config.SUCCESS_BADGE || '¡TIENES UN 30% DE DESCUENTO!'}
                          </div>
                          <p className="text-zinc-400 max-w-sm mx-auto">
                            {config.SUCCESS_TEXT || 'Un técnico especialista se comunicará contigo vía WhatsApp en breve para coordinar tu descuento y cita.'}
                          </p>
                        </>
                      ) : (
                        <p className="text-zinc-400 text-lg max-w-sm mx-auto">
                          Tu solicitud ha sido registrada con éxito. Un asesor de servicio te contactará de inmediato por WhatsApp para confirmar tu cita.
                        </p>
                      )}
                      <button
                        onClick={() => { setFormStatus('idle'); setSelectedService('Línea de inspección gratuita'); }}
                        className="mt-8 text-primary font-bold uppercase tracking-widest text-xs hover:underline"
                      >
                        Solicitar otra cita
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <div className="mb-6">
                        <h2 className="text-2xl font-black tracking-tight mb-1">Completa tu registro</h2>
                        <p className="text-sm text-zinc-500">Solo unos datos y te contactamos por WhatsApp al instante.</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Nombre</label>
                          <input
                            required
                            name="nombre"
                            type="text"
                            placeholder="Tu Nombre"
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 focus:border-primary outline-none transition-all placeholder:text-zinc-700 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Teléfono</label>
                          <input
                            required
                            name="telefono"
                            type="tel"
                            placeholder="0412 000 0000"
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 focus:border-primary outline-none transition-all placeholder:text-zinc-700 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Vehículo</label>
                        <div className="relative">
                          <Car className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                          <input
                            required
                            name="vehiculo"
                            type="text"
                            placeholder="Ej: Toyota Hilux 2022"
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:border-primary outline-none transition-all placeholder:text-zinc-700 text-white"
                          />
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
                          <option value="Línea de inspección gratuita">Línea de inspección gratuita</option>
                          <option value="Mecánica general">Mecánica general</option>
                          <option value="Mantenimiento preventivo">Mantenimiento preventivo</option>
                          <option value="Electricidad y electrónica">Electricidad y electrónica</option>
                          <option value="Frenos y suspensión">Frenos y suspensión</option>
                          <option value="Inyección electrónica">Inyección electrónica</option>
                          <option value="Climatización">Climatización</option>
                          <option value="Otro">Otro (Especificar)</option>
                        </select>
                      </div>

                      <AnimatePresence>
                        {selectedService === 'Otro' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-2 overflow-hidden"
                          >
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Descripción del Servicio</label>
                            <textarea
                              required
                              name="falla"
                              placeholder="Describe brevemente lo que necesitas..."
                              rows={2}
                              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:border-primary outline-none transition-all text-sm resize-none text-white"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button
                        disabled={formStatus === 'loading'}
                        type="submit"
                        className="btn-primary w-full !py-5 shadow-[0_20px_50px_rgba(229,57,53,0.3)] flex items-center justify-center gap-3 text-base"
                      >
                        {formStatus === 'loading' ? (
                          'Procesando...'
                        ) : (
                          <>AGENDAR MI CITA VÍA WHATSAPP <ArrowRight className="w-5 h-5" /></>
                        )}
                      </button>

                      {formStatus === 'error' && (
                        <p className="text-primary text-center text-sm font-bold pt-1">{formErrorMessage}</p>
                      )}

                      <p className="text-xs text-center text-zinc-500 leading-relaxed font-medium pt-1">
                        Una vez enviado, un asesor de servicio te contactará de inmediato por WhatsApp para confirmar tu hora exacta. ¡Te esperamos con el café listo! ☕
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-zinc-600 text-xs border-t border-white/5 relative z-10 bg-black/40">
        © 2026 MASTERTECH AUTOMOTRIZ. Todos los derechos reservados.
      </footer>

      {/* WhatsApp floating button */}
      <a
        href={config.WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] p-4 rounded-full shadow-2xl hover:scale-110 transition-transform animate-float flex items-center justify-center group"
      >
        <span className="absolute right-full mr-3 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">¡Escríbenos ahora!</span>
        <MessageCircle className="w-8 h-8 text-white fill-current" />
      </a>
    </div>
  );
}
