import React, { useState } from 'react';
import { CheckCircle2, Phone, Calendar, Car, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import InspectionSlotPicker from './InspectionSlotPicker';

const CONFIG = {
  PHONE_NUMBER: "+584123565012", 
  LOGO_URL: "/logo.png", 
};

export default function Inspeccion() {
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inspectionSlotStr, setInspectionSlotStr] = useState<string>('');
  const [isInspectionSlotValid, setIsInspectionSlotValid] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('loading');
    setFormErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    data.servicio = "Línea de inspección gratuita"; 
    if (inspectionSlotStr) {
      data.fecha_hora = inspectionSlotStr;
    }
    data.vehiculo = data.vehiculo || "No especificado (Landing Inspección)";

    // Create local lead object immediately for client-side storage
    const localLead = {
      id: Date.now(),
      nombre: String(data.nombre || ''),
      telefono: String(data.telefono || ''),
      vehiculo: String(data.vehiculo || ''),
      servicio: String(data.servicio || 'Línea de inspección gratuita'),
      status: 'Pendiente',
      falla: String(data.falla || ''),
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
      }
    } catch (error) {
      console.warn("Fetch completed with local storage sync:", error);
    } finally {
      setFormStatus('success');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col selection:bg-primary selection:text-white">
      {/* Header Minimalista */}
      <header className="py-6 px-6 flex justify-center border-b border-white/5 bg-[#0d0e12]/90 backdrop-blur-xl">
        <img src={CONFIG.LOGO_URL} alt="MasterTech" className="h-10 w-auto" />
      </header>

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto w-full relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 text-primary font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              Diagnóstico de Alta Precisión
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter mb-6 leading-[1.1]">
              REGÍSTRATE PARA SABER EXACTAMENTE <br className="hidden md:block"/> 
              <span className="text-primary" style={{ textShadow: '0 0 30px rgba(255,42,42,0.3)' }}>
                QUÉ NECESITA TU CARRO
              </span> <br className="hidden md:block"/>
              ANTES DE VIAJAR O COMPRAR
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              No dejes tu seguridad al azar. Nuestra línea de inspección evalúa más de 40 puntos críticos de tu vehículo con tecnología de vanguardia para que tomes decisiones informadas y viajes con total tranquilidad.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 mb-12 text-left max-w-3xl mx-auto backdrop-blur-md">
              <h3 className="text-2xl font-black mb-6 text-center">¿Qué incluye la inspección y por qué la hacemos?</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-white mb-1">Diagnóstico Computarizado</h4>
                    <p className="text-sm text-zinc-400">Escaneo de todos los módulos electrónicos para detectar fallas ocultas antes de que sean problemas costosos.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-white mb-1">Revisión de Tren Delantero</h4>
                    <p className="text-sm text-zinc-400">Evaluación de amortiguadores, bujes y terminales para garantizar estabilidad en la vía.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-white mb-1">Inspección de Frenos</h4>
                    <p className="text-sm text-zinc-400">Medición del desgaste de pastillas y discos. Tu seguridad y la de tu familia es nuestra prioridad.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-white mb-1">Estado de Fluidos</h4>
                    <p className="text-sm text-zinc-400">Chequeo de niveles y calidad de aceite de motor, transmisión, liga de frenos y refrigerante.</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white font-black text-xl md:text-2xl py-6 px-12 rounded-2xl shadow-[0_20px_50px_rgba(229,57,53,0.4)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-4 mx-auto w-full md:w-auto"
            >
              RESERVAR MI CUPO GRATIS <ArrowRight className="w-8 h-8" />
            </button>
          </motion.div>
        </div>
      </main>

      {/* Modal / Formulario Oculto */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#12141a] border border-white/10 rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {formStatus === 'success' ? (
                <div className="text-center py-10">
                  <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">¡CUPO RESERVADO!</h3>
                  <p className="text-zinc-400 mb-6">Tu reserva ha sido recibida. Un asesor de servicio te contactará de inmediato por WhatsApp para confirmar los detalles.</p>
                  <button onClick={() => { setFormStatus('idle'); setIsModalOpen(false); }} className="text-primary font-bold uppercase tracking-widest text-xs hover:underline">Cerrar</button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-black mb-2">Comienza tu Registro</h3>
                    <p className="text-sm text-zinc-400">Completa estos 3 datos y asegura tu inspección gratuita.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Nombre Completo</label>
                      <input required name="nombre" type="text" placeholder="Tu Nombre" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 focus:border-primary outline-none transition-all placeholder:text-zinc-700" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Teléfono (WhatsApp)</label>
                      <div className="relative">
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                        <input required name="telefono" type="tel" placeholder="0412 000 0000" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:border-primary outline-none transition-all placeholder:text-zinc-700" />
                      </div>
                    </div>

                    <InspectionSlotPicker 
                      onSelectSlot={(slotStr, isValid) => {
                        setInspectionSlotStr(slotStr);
                        setIsInspectionSlotValid(isValid);
                      }} 
                    />

                    <button disabled={formStatus === 'loading'} type="submit" className="bg-primary hover:bg-primary/90 text-white font-black text-lg py-5 px-6 rounded-2xl w-full shadow-[0_10px_30px_rgba(229,57,53,0.3)] transition-all mt-4">
                      {formStatus === 'loading' ? 'Procesando...' : 'RESERVAR AHORA'}
                    </button>
                    
                    <p className="text-xs text-center text-zinc-500 font-medium pt-2">
                      Una vez enviado, te contactaremos de inmediato por WhatsApp para confirmar. ¡Te esperamos con el café listo! ☕
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="py-6 text-center text-zinc-600 text-xs border-t border-white/5 relative z-10 bg-black/40">
        © 2026 MASTERTECH AUTOMOTRIZ. Todos los derechos reservados.
      </footer>
    </div>
  );
}
