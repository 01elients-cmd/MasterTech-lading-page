import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Car,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import InspectionSlotPicker from './InspectionSlotPicker';

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

const CONFIG_DEFAULT = {
  PHONE_NUMBER: "+584123565012",
  WHATSAPP_LINK: "https://wa.link/xnj37f",
  WEBHOOK_URL: "https://script.google.com/macros/s/AKfycbxIzUm7itb1hP8BCfbt3tWThExU_jBM9h_-kxJbGb7TlMryGA-zc01OmRnoAASU5AOM/exec",
  GOOGLE_MAPS_LINK: "https://maps.app.goo.gl/fybS1jW9buxQD5gv7",
  LOGO_URL: "/logo.png",
  SUCCESS_BADGE: "¡TIENES HASTA UN 15% DE DESCUENTO!",
  SUCCESS_TEXT: "Un técnico especialista se comunicará contigo vía WhatsApp en breve para coordinar tu descuento y cita.",
};

export default function Contacto() {
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [selectedService, setSelectedService] = useState('Línea de inspección gratuita');
  const [inspectionSlotStr, setInspectionSlotStr] = useState<string>('');
  const [isInspectionSlotValid, setIsInspectionSlotValid] = useState<boolean>(false);
  const [config, setConfig] = useState<any>(CONFIG_DEFAULT);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
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
      try { if (localData.SERVICES_JSON) setServices(JSON.parse(localData.SERVICES_JSON)); } catch (e) {}
    }

    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.SUCCESS_BADGE && data.SUCCESS_BADGE.includes('30%')) {
            data.SUCCESS_BADGE = '¡TIENES HASTA UN 15% DE DESCUENTO!';
          }
          setConfig((prev: any) => ({ ...prev, ...data }));
          try { if (data.SERVICES_JSON) setServices(JSON.parse(data.SERVICES_JSON)); } catch (e) {}
          try { localStorage.setItem('mastertech_settings_store', JSON.stringify(data)); } catch (e) {}
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

    if (selectedService === 'Línea de inspección gratuita') {
      if (inspectionSlotStr) {
        data.fecha_hora = inspectionSlotStr;
      }
    }

    const desc = data.descripcion ? ` — ${data.descripcion}` : '';
    data.servicio = selectedService === 'Otro'
      ? `Otro: ${data.descripcion}`
      : `${selectedService}${desc}`;

    // Create local lead object immediately for client-side storage
    const localLead = {
      id: Date.now(),
      nombre: String(data.nombre || ''),
      telefono: String(data.telefono || ''),
      vehiculo: String(data.vehiculo || ''),
      servicio: String(data.servicio || ''),
      status: 'Pendiente',
      falla: String(data.descripcion || ''),
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
        headers: { 'Content-Type': 'application/json' },
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

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#E2E8F0] selection:bg-primary selection:text-black flex flex-col overflow-x-hidden w-full max-w-full">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/8 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <header className="py-5 px-6 flex justify-center border-b border-white/5 bg-[#0d0e12]/90 backdrop-blur-xl relative z-10">
        <a href="/" className="cursor-pointer hover:opacity-90 transition-opacity">
          <img src={config.LOGO_URL || "/logo.png"} alt="MasterTech" className="h-10 w-auto" />
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16 relative z-10">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Page Title */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 text-primary font-bold text-xs uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Agenda tu cita
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-black tracking-tighter leading-none mb-4">
                RESERVA TU <br />
                <span className="text-primary italic">CUPO</span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-xl mx-auto">
                Estamos listos para recibirte. Completa los datos y te asignaremos un técnico especialista.
              </p>
            </div>

            {/* Booking Form — full width */}
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <AnimatePresence mode="wait">
                {formStatus === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">¡CITA SOLICITADA!</h2>
                    {selectedService === 'Línea de inspección gratuita' ? (
                      <>
                        <div className="inline-block bg-primary/20 border border-primary text-primary px-4 py-2 rounded-full font-bold tracking-widest text-sm mb-6 animate-pulse">
                          {(config.SUCCESS_BADGE && !config.SUCCESS_BADGE.includes('30%')) ? config.SUCCESS_BADGE : '¡TIENES HASTA UN 15% DE DESCUENTO!'}
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

                    {/* Action buttons on success */}
                    <div className="grid grid-cols-2 gap-4 mt-8 max-w-sm mx-auto">
                      <a
                        href={config.GOOGLE_MAPS_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/40 hover:bg-white/8 transition-all duration-300 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                          <MapPin size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Ubicación</p>
                          <p className="text-sm font-black text-white leading-tight">Porlamar,<br/>Nueva Esparta</p>
                        </div>
                      </a>
                      <a
                        href={config.WHATSAPP_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 p-4 bg-[#25D366]/10 border border-[#25D366]/20 rounded-2xl hover:border-[#25D366]/50 hover:bg-[#25D366]/15 transition-all duration-300 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#25D366]/15 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all shrink-0">
                          <WhatsAppIcon size={18} className="fill-current" />
                        </div>
                        <div className="text-left">
                          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Escríbenos</p>
                          <p className="text-sm font-black text-[#25D366]">Chat en<br/>WhatsApp</p>
                        </div>
                      </a>
                    </div>

                    <button
                      onClick={() => { setFormStatus('idle'); setSelectedService('Línea de inspección gratuita'); }}
                      className="mt-6 text-primary font-bold uppercase tracking-widest text-xs hover:underline"
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

                    {/* Nombre + Teléfono */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="contacto-nombre" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Nombre</label>
                        <input
                          id="contacto-nombre"
                          required
                          name="nombre"
                          type="text"
                          placeholder="Ej: Carlos Rodríguez"
                          className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 focus:border-primary outline-none transition-all placeholder:text-zinc-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="contacto-telefono" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Teléfono</label>
                        <input
                          id="contacto-telefono"
                          required
                          name="telefono"
                          type="tel"
                          placeholder="Ej: 0412 000 0000"
                          className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 focus:border-primary outline-none transition-all placeholder:text-zinc-700 text-white"
                        />
                      </div>
                    </div>

                    {/* Vehículo */}
                    <div className="space-y-2">
                      <label htmlFor="contacto-vehiculo" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Vehículo</label>
                      <div className="relative">
                        <Car className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                        <input
                          id="contacto-vehiculo"
                          required
                          name="vehiculo"
                          type="text"
                          placeholder="Ej: Toyota Hilux 2022 — Gris"
                          className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:border-primary outline-none transition-all placeholder:text-zinc-700 text-white"
                        />
                      </div>
                    </div>

                    {/* Servicio */}
                    <div className="space-y-2">
                      <label htmlFor="contacto-servicio" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Servicio Requerido</label>
                      <select
                        id="contacto-servicio"
                        name="servicio"
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 focus:border-primary outline-none transition-all appearance-none cursor-pointer text-white"
                      >
                        <option value="Línea de inspección gratuita">Línea de inspección gratuita</option>
                        {services.length > 0 ? (
                          services.map((s, idx) => (
                            <option key={s.id || idx} value={s.title}>{s.title}</option>
                          ))
                        ) : (
                          <>
                            <option value="Mecánica general">Mecánica general</option>
                            <option value="Mantenimiento preventivo">Mantenimiento preventivo</option>
                            <option value="Electricidad y electrónica">Electricidad y electrónica</option>
                            <option value="Frenos y suspensión">Frenos y suspensión</option>
                            <option value="Inyección electrónica">Inyección electrónica</option>
                            <option value="Climatización">Climatización</option>
                          </>
                        )}
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

                    {/* Descripción — siempre visible */}
                    <motion.div layout className="space-y-2">
                      <label htmlFor="contacto-descripcion" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                        {selectedService === 'Otro' ? 'Descripción del Servicio' : 'Descripción / Observaciones'}
                      </label>
                      <textarea
                        id="contacto-descripcion"
                        required={selectedService === 'Otro'}
                        name="descripcion"
                        placeholder={
                          selectedService === 'Línea de inspección gratuita'
                            ? 'Ej: Quiero revisar el vehículo antes de un viaje largo...'
                            : selectedService === 'Mecánica general'
                            ? 'Ej: El motor hace un ruido extraño al arrancar...'
                            : selectedService === 'Mantenimiento preventivo'
                            ? 'Ej: Cambio de aceite y filtros, revisión general...'
                            : selectedService === 'Electricidad y electrónica'
                            ? 'Ej: Se apaga el tablero, falla en el sistema eléctrico...'
                            : selectedService === 'Frenos y suspensión'
                            ? 'Ej: Vibración al frenar, ruido en la suspensión...'
                            : selectedService === 'Inyección electrónica'
                            ? 'Ej: Luz de check encendida, falla en inyectores...'
                            : selectedService === 'Climatización'
                            ? 'Ej: El aire acondicionado no enfría bien...'
                            : 'Describe detalladamente lo que necesitas...'
                        }
                        rows={3}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 focus:border-primary outline-none transition-all text-sm resize-none text-white placeholder:text-zinc-700"
                      />
                    </motion.div>

                    {/* Submit button */}
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

                    {/* Two action buttons below submit */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <a
                        href={config.GOOGLE_MAPS_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/40 hover:bg-white/8 transition-all duration-300 group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-0.5">Ubicación</p>
                          <p className="text-sm font-black text-white leading-tight">Porlamar,<br/>Nueva Esparta</p>
                        </div>
                      </a>

                      <a
                        href={config.WHATSAPP_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-[#25D366]/10 border border-[#25D366]/20 rounded-2xl hover:border-[#25D366]/50 hover:bg-[#25D366]/15 transition-all duration-300 group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all shrink-0">
                          <WhatsAppIcon size={20} className="fill-current" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-0.5">Escríbenos ahora</p>
                          <p className="text-sm font-black text-[#25D366]">Chat en WhatsApp</p>
                        </div>
                      </a>
                    </div>

                    <p className="text-xs text-center text-zinc-500 leading-relaxed font-medium pt-1">
                      Una vez enviado, un asesor de servicio te contactará de inmediato por WhatsApp para confirmar tu hora exacta. ¡Te esperamos con el café listo! ☕
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
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
