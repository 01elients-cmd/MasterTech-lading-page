import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Calendar,
  LogOut,
  Settings as SettingsIcon,
  Trash2,
  Edit,
  MessageCircle,
  ExternalLink,
  Lock,
  RefreshCw,
  AlertCircle,
  User,
  Car,
  Wrench,
  CheckCircle2,
  Clock,
  Briefcase,
  X,
  FileText,
  Activity,
  ArrowLeft,
  Eye,
  Check
} from 'lucide-react';
import ImageUploader from './components/ImageUploader';

const DEFAULT_SERVICES = [
  { id: 1, title: "Mecánica General", desc: "Reparación profunda de motores, sustitución de embragues y solución de fallas mecánicas complejas con repuestos de alta calidad.", img: "/assets/servicio-mecanica.jpg" },
  { id: 2, title: "Mantenimiento Preventivo", desc: "Cambios de aceite sintético, reemplazo de filtros y fluidos esenciales para alargar la vida útil de tu motor.", img: "/24214142.png" },
  { id: 3, title: "Electricidad y Electrónica", desc: "Diagnóstico computarizado, reparación de alternadores, arranques y corrección de cableado y módulos electrónicos.", img: "/assets/servicio-electricidad.jpg" },
  { id: 4, title: "Frenos y Suspensión", desc: "Cambio de pastillas, rectificación de discos, reemplazo de amortiguadores y ajuste completo de tren delantero.", img: "/assets/servicio-frenos.jpg" },
  { id: 5, title: "Inyección Electrónica", desc: "Limpieza ultrasónica de inyectores, diagnóstico de bombas de gasolina y optimización del consumo de combustible.", img: "/assets/servicio-inyeccion.jpg" },
  { id: 6, title: "Climatización", desc: "Carga de gas refrigerante, detección de fugas y mantenimiento completo del sistema de aire acondicionado.", img: "/assets/servicio-climatizacion.jpg" },
  { id: 7, title: "Zona de Lavado", desc: "Lavado detallado de carrocería, limpieza profunda de motor e interior para entregar tu vehículo impecable.", img: "/assets/hero_bg.png" }
];

interface Lead {
  id: number;
  nombre: string;
  telefono: string;
  vehiculo: string;
  servicio: string;
  status: string;
  notes: string;
  created_at: string;
  placa?: string;
  anio?: string;
  ubicacion?: string;
  falla?: string;
}

interface Settings {
  PHONE_NUMBER: string;
  WHATSAPP_LINK: string;
  WEBHOOK_URL: string;
  GOOGLE_MAPS_LINK: string;
  GOOGLE_MAPS_EMBED: string;
  GOOGLE_BUSINESS_URL: string;
  HERO_IMG: string;
  LOGO_URL: string;
  BEFORE_AFTER_1: string;
  BEFORE_AFTER_2: string;
  HERO_REEL_URL?: string;
  IMG_INSTALACIONES?: string;
  IMG_SRV_MECANICA?: string;
  IMG_SRV_MANTENIMIENTO?: string;
  IMG_SRV_ELECTRICIDAD?: string;
  IMG_SRV_FRENOS?: string;
  IMG_SRV_INYECCION?: string;
  IMG_SRV_CLIMATIZACION?: string;
  IMG_SRV_LAVADO?: string;
  IS_OPEN: string;
  BANNER_TEXT: string;
  WHATSAPP_MESSAGE_TEMPLATE?: string;
  SUCCESS_BADGE?: string;
  SUCCESS_TEXT?: string;
  
  // Servicios
  DESC_SRV_MECANICA?: string;
  DESC_SRV_MANTENIMIENTO?: string;
  DESC_SRV_ELECTRICIDAD?: string;
  DESC_SRV_FRENOS?: string;
  DESC_SRV_INYECCION?: string;
  DESC_SRV_CLIMATIZACION?: string;
  DESC_SRV_LAVADO?: string;

  // Equipo
  TEAM_1_NAME?: string; TEAM_1_ROLE?: string; TEAM_1_DESC?: string; TEAM_1_IMG?: string;
  TEAM_2_NAME?: string; TEAM_2_ROLE?: string; TEAM_2_DESC?: string; TEAM_2_IMG?: string;
  TEAM_3_NAME?: string; TEAM_3_ROLE?: string; TEAM_3_DESC?: string; TEAM_3_IMG?: string;

  // Reseñas
  REV_1_NAME?: string; REV_1_CAR?: string; REV_1_QUOTE?: string;
  REV_2_NAME?: string; REV_2_CAR?: string; REV_2_QUOTE?: string;
  REV_3_NAME?: string; REV_3_CAR?: string; REV_3_QUOTE?: string;
}

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('mastertech_admin_token'));
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  
  // Dynamic JSON States
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [services, setServices] = useState<any[]>(DEFAULT_SERVICES);
  
  // Active Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'settings'>('dashboard');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  // Selected Lead for details modal
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [noteEdit, setNoteEdit] = useState('');
  const [statusEdit, setStatusEdit] = useState('');
  const [isUpdatingLead, setIsUpdatingLead] = useState(false);

  // Settings edit state
  const [settingsForm, setSettingsForm] = useState<Partial<Settings>>({});
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccessMessage, setSettingsSuccessMessage] = useState('');
  const [settingsErrorMessage, setSettingsErrorMessage] = useState('');

  // Fetch all leads with LocalStorage caching fallback for VPN/network stability
  const fetchLeads = async (authToken: string) => {
    setIsLoadingLeads(true);
    let apiLeads: any[] = [];
    try {
      const res = await fetch('/api/leads', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        apiLeads = Array.isArray(data) ? data : [];
      } else if (res.status === 401) {
        handleLogout();
        setIsLoadingLeads(false);
        return;
      }
    } catch (err) {
      console.warn('Network issue fetching leads from API:', err);
    }

    // Merge with local storage leads
    let localLeads: any[] = [];
    try {
      const c1 = localStorage.getItem('mastertech_leads_store');
      const c2 = localStorage.getItem('cached_admin_leads');
      if (c1) localLeads.push(...JSON.parse(c1));
      if (c2) localLeads.push(...JSON.parse(c2));
    } catch (e) {}

    const combinedMap = new Map();
    for (const lead of apiLeads) {
      if (lead && (lead.id || lead.nombre)) {
        combinedMap.set(String(lead.id || `${lead.nombre}-${lead.telefono}`), lead);
      }
    }
    for (const lead of localLeads) {
      if (lead && (lead.id || lead.nombre)) {
        const key = String(lead.id || `${lead.nombre}-${lead.telefono}`);
        if (!combinedMap.has(key)) {
          combinedMap.set(key, lead);
        }
      }
    }

    const finalLeads = Array.from(combinedMap.values()).sort((a: any, b: any) => {
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

    setLeads(finalLeads);
    try { localStorage.setItem('cached_admin_leads', JSON.stringify(finalLeads)); } catch (e) {}
    try { localStorage.setItem('mastertech_leads_store', JSON.stringify(finalLeads)); } catch (e) {}
    setIsLoadingLeads(false);
  };

  // Fetch settings
  const fetchSettings = async () => {
    setIsLoadingSettings(true);
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setSettingsForm(data);
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
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    if (token) {
      fetchLeads(token);
    }
  }, [token]);

  useEffect(() => {
    if (token && activeTab === 'leads') {
      fetchLeads(token);
    }
  }, [activeTab, token]);

  // Live polling every 8 seconds for real-time lead updates
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      fetchLeads(token);
    }, 8000);
    return () => clearInterval(interval);
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('mastertech_admin_token', data.token);
        setToken(data.token);
      } else {
        setAuthError(data.error || 'Contraseña incorrecta');
      }
    } catch (err) {
      setAuthError('Error de conexión con el servidor.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (e) {
        console.error('Logout error on server', e);
      }
    }
    localStorage.removeItem('mastertech_admin_token');
    setToken(null);
    setLeads([]);
  };

  // Update lead status/notes
  const handleUpdateLead = async (leadId: number) => {
    if (!token) return;
    setIsUpdatingLead(true);

    // Immediate optimistic local update
    setLeads(prev => prev.map(l => String(l.id) === String(leadId) ? { ...l, status: statusEdit, notes: noteEdit } : l));
    if (selectedLead && String(selectedLead.id) === String(leadId)) {
      setSelectedLead({ ...selectedLead, status: statusEdit, notes: noteEdit });
    }

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: statusEdit,
          notes: noteEdit
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setLeads(prev => prev.map(l => String(l.id) === String(leadId) ? { ...l, ...updated } : l));
        if (selectedLead && String(selectedLead.id) === String(leadId)) {
          setSelectedLead(prev => prev ? { ...prev, ...updated } : null);
        }
      }
    } catch (err) {
      console.warn('Network issue updating lead status:', err);
    } finally {
      setIsUpdatingLead(false);
      try {
        const updatedList = leads.map(l => String(l.id) === String(leadId) ? { ...l, status: statusEdit, notes: noteEdit } : l);
        localStorage.setItem('cached_admin_leads', JSON.stringify(updatedList));
        localStorage.setItem('mastertech_leads_store', JSON.stringify(updatedList));
      } catch (e) {}
    }
  };

  // Delete lead
  const handleDeleteLead = async (leadId: number) => {
    if (!token) return;
    if (!window.confirm('¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.')) return;

    // Immediate optimistic local removal
    const newList = leads.filter(l => String(l.id) !== String(leadId));
    setLeads(newList);
    if (selectedLead && String(selectedLead.id) === String(leadId)) {
      setSelectedLead(null);
    }

    try {
      localStorage.setItem('cached_admin_leads', JSON.stringify(newList));
      localStorage.setItem('mastertech_leads_store', JSON.stringify(newList));
    } catch (e) {}

    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      console.warn('Network issue deleting lead:', err);
    }
  };

  // Update settings on server
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSavingSettings(true);
    setSettingsSuccessMessage('');
    setSettingsErrorMessage('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...settingsForm,
          SERVICES_JSON: JSON.stringify(services),
          TEAM_MEMBERS_JSON: JSON.stringify(teamMembers),
          REVIEWS_JSON: JSON.stringify(reviews),
          BRANDS_JSON: JSON.stringify(brands.filter(b => b.trim() !== ''))
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSettings(data.settings);
        setSettingsForm(data.settings);
        if (data.settings?.SERVICES_JSON) {
          try { setServices(JSON.parse(data.settings.SERVICES_JSON)); } catch(e){}
        }
        setSettingsSuccessMessage('¡Configuraciones guardadas y actualizadas en tiempo real!');
        setTimeout(() => setSettingsSuccessMessage(''), 4000);
      } else {
        setSettingsErrorMessage(data.error || 'Error al guardar los cambios en el servidor.');
      }
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setSettingsErrorMessage('Error de conexión al guardar los ajustes.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Filter leads based on query and status select
  const filteredLeads = leads.filter(lead => {
    if (!lead) return false;
    const nombre = (lead.nombre || '').toLowerCase();
    const telefono = lead.telefono || '';
    const vehiculo = (lead.vehiculo || '').toLowerCase();
    const servicio = (lead.servicio || '').toLowerCase();
    const fechaHora = (lead.fecha_hora || '').toLowerCase();
    const q = (searchQuery || '').toLowerCase();

    const matchesSearch = q === '' ||
      nombre.includes(q) ||
      telefono.includes(q) ||
      vehiculo.includes(q) ||
      servicio.includes(q) ||
      fechaHora.includes(q);

    const matchesStatus = statusFilter === 'Todos' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalLeads = leads.length;
  const pendingLeads = leads.filter(l => l && l.status === 'Pendiente').length;
  const contactedLeads = leads.filter(l => l && l.status === 'Contactado').length;
  const diagnosticLeads = leads.filter(l => l && l.status === 'En Diagnóstico').length;
  const completedLeads = leads.filter(l => l && l.status === 'Completado').length;
  const cancelledLeads = leads.filter(l => l && l.status === 'Cancelado').length;

  // Group leads by service
  const serviceCounts: Record<string, number> = {};
  leads.forEach(l => {
    if (!l) return;
    const srv = l.servicio || 'Sin Especificar';
    serviceCounts[srv] = (serviceCounts[srv] || 0) + 1;
  });

  // Group leads by brand
  const brandCounts: Record<string, number> = {};
  const knownBrandsList = brands.length > 0 ? brands : ['Jeep', 'Toyota', 'Honda', 'Dodge', 'Nissan', 'Chrysler', 'Lexus'];
  leads.forEach(l => {
    if (!l) return;
    const vehicleLower = (l.vehiculo || '').toLowerCase();
    let detectedBrand = 'Otro';
    for (const brand of knownBrandsList) {
      if (brand && vehicleLower.includes(brand.toLowerCase())) {
        detectedBrand = brand;
        break;
      }
    }
    brandCounts[detectedBrand] = (brandCounts[detectedBrand] || 0) + 1;
  });

  // Generate WhatsApp link helper
  const getWhatsAppContactUrl = (lead: Lead) => {
    let phone = lead.telefono.replace(/\D/g, '');
    
    // Check Venezuelan phone formats
    if (phone.startsWith('0') && phone.length === 11) {
      phone = '58' + phone.substring(1);
    } else if (phone.length === 10 && !phone.startsWith('58')) {
      phone = '58' + phone;
    }
    
    let message = settings?.WHATSAPP_MESSAGE_TEMPLATE || `Hola *{nombre}*, te saludamos desde *Taller MasterTech* 🛠️. Hemos recibido tu solicitud para el servicio de *{servicio}* para tu *{vehiculo}*. Quisiéramos coordinar los detalles de tu cita. ¿En qué horario te resultaría más cómodo asistir?`;
    
    message = message
      .replace(/{nombre}/g, lead.nombre)
      .replace(/{servicio}/g, lead.servicio)
      .replace(/{vehiculo}/g, lead.vehiculo);
      
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  // Render Login view
  if (!token) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 font-sans select-none relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 blur-[150px] rounded-full" />

        <div className="max-w-md w-full glass-card p-10 relative z-10 border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight uppercase text-white">
              MASTER<span className="text-primary">TECH</span>
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">
              Panel de Administración
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                Contraseña de Acceso
              </label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 focus:border-primary outline-none transition-all placeholder:text-zinc-700 text-center text-xl tracking-widest text-white"
              />
            </div>

            {authError && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              disabled={isAuthenticating}
              type="submit"
              className="btn-primary w-full !py-4 shadow-[0_20px_50px_rgba(229,57,53,0.2)] font-black tracking-widest uppercase text-xs cursor-pointer"
            >
              {isAuthenticating ? 'Autenticando...' : 'INGRESAR AL PANEL'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full text-center text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Volver al sitio público
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white font-sans flex flex-col selection:bg-primary selection:text-white">
      {/* Admin Header */}
      <header className="border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-xl py-4 px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xl font-display font-black tracking-tighter text-white">
              MASTER<span className="text-primary">TECH</span>
            </span>
            <span className="h-4 w-px bg-white/10 hidden md:block" />
            <span className="bg-primary/10 border border-primary/20 text-primary font-black uppercase tracking-widest text-[9px] px-3 py-1 rounded-full">
              PANEL ADMIN
            </span>

            {/* Quick Workshop Status Widget */}
            {settings && (
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                settings.IS_OPEN === 'true'
                  ? 'bg-green-500/10 border-green-500/20 text-green-400'
                  : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${settings.IS_OPEN === 'true' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
                {settings.IS_OPEN === 'true' ? 'Taller Abierto' : 'Taller Cerrado'}
              </span>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/5 p-1 rounded-full">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === 'leads' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Citas ({totalLeads})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === 'settings' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Ajustes Web
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer border border-white/5"
            >
              <ExternalLink className="w-4 h-4" /> Ver Web
            </button>
            <button
              onClick={handleLogout}
              className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors bg-white/5 hover:bg-red-500/10 px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer border border-white/5"
            >
              <LogOut className="w-4 h-4" /> Salir
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8">
        
        {/* --- TAB: DASHBOARD --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              
              <div className="glass-card p-6 border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
                  <FileText size={60} />
                </div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Total Solicitudes</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-black text-white">{totalLeads}</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                  <div className="bg-zinc-400 h-full rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="glass-card p-6 border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-yellow-500">
                  <Clock size={60} />
                </div>
                <p className="text-[10px] font-bold text-yellow-500/60 uppercase tracking-widest mb-2">Pendientes</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-black text-yellow-500">{pendingLeads}</span>
                  {totalLeads > 0 && (
                    <span className="text-xs text-zinc-500 font-bold">({Math.round((pendingLeads/totalLeads)*100)}%)</span>
                  )}
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                  <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${totalLeads > 0 ? (pendingLeads/totalLeads)*100 : 0}%` }} />
                </div>
              </div>

              <div className="glass-card p-6 border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-blue-500">
                  <MessageCircle size={60} />
                </div>
                <p className="text-[10px] font-bold text-blue-500/60 uppercase tracking-widest mb-2">Contactados</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-black text-blue-400">{contactedLeads}</span>
                  {totalLeads > 0 && (
                    <span className="text-xs text-zinc-500 font-bold">({Math.round((contactedLeads/totalLeads)*100)}%)</span>
                  )}
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                  <div className="bg-blue-400 h-full rounded-full" style={{ width: `${totalLeads > 0 ? (contactedLeads/totalLeads)*100 : 0}%` }} />
                </div>
              </div>

              <div className="glass-card p-6 border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-red-500">
                  <Activity size={60} />
                </div>
                <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest mb-2">En Diagnóstico</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-black text-primary">{diagnosticLeads}</span>
                  {totalLeads > 0 && (
                    <span className="text-xs text-zinc-500 font-bold">({Math.round((diagnosticLeads/totalLeads)*100)}%)</span>
                  )}
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${totalLeads > 0 ? (diagnosticLeads/totalLeads)*100 : 0}%` }} />
                </div>
              </div>

              <div className="glass-card p-6 border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-green-500">
                  <CheckCircle2 size={60} />
                </div>
                <p className="text-[10px] font-bold text-green-500/60 uppercase tracking-widest mb-2">Completados</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-black text-green-400">{completedLeads}</span>
                  {totalLeads > 0 && (
                    <span className="text-xs text-zinc-500 font-bold">({Math.round((completedLeads/totalLeads)*100)}%)</span>
                  )}
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                  <div className="bg-green-400 h-full rounded-full" style={{ width: `${totalLeads > 0 ? (completedLeads/totalLeads)*100 : 0}%` }} />
                </div>
              </div>

            </div>

            {/* Analytics Layout */}
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Service Distribution Graph (Custom Styled CSS Bars) */}
              <div className="glass-card p-8 border-white/5 lg:col-span-2 space-y-6">
                <h3 className="text-lg font-black uppercase tracking-wider text-white">
                  Distribución por Servicio Solicitado
                </h3>
                <div className="space-y-4">
                  {Object.keys(serviceCounts).length === 0 ? (
                    <p className="text-zinc-500 text-sm py-10 text-center">No hay datos de citas registrados.</p>
                  ) : (
                    Object.entries(serviceCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([serviceName, value], i) => {
                        const percent = totalLeads > 0 ? Math.round((value / totalLeads) * 100) : 0;
                        return (
                          <div key={serviceName} className="space-y-1">
                            <div className="flex justify-between items-center text-sm">
                              <span className="font-bold text-zinc-300">{serviceName}</span>
                              <span className="font-black text-white">{value} cita(s) <span className="text-zinc-500 font-bold">({percent}%)</span></span>
                            </div>
                            <div className="w-full h-3 bg-white/5 border border-white/5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${
                                  i === 0 ? 'bg-primary' : i === 1 ? 'bg-zinc-400' : i === 2 ? 'bg-zinc-600' : 'bg-zinc-800'
                                }`} 
                                style={{ width: `${percent}%` }} 
                              />
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>

              {/* Brand Distribution Graph (Custom CSS Ring/Gauge or Pie equivalent) */}
              <div className="glass-card p-8 border-white/5 space-y-6 flex flex-col">
                <h3 className="text-lg font-black uppercase tracking-wider text-white mb-2">
                  Marcas de Vehículos
                </h3>
                <div className="flex-1 flex flex-col justify-center space-y-4">
                  {Object.keys(brandCounts).length === 0 ? (
                    <p className="text-zinc-500 text-sm py-10 text-center">No hay datos de vehículos.</p>
                  ) : (
                    Object.entries(brandCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([brand, value], i) => {
                        const percent = totalLeads > 0 ? Math.round((value / totalLeads) * 100) : 0;
                        return (
                          <div key={brand} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className={`w-3 h-3 rounded-full ${
                                i === 0 ? 'bg-primary' : i === 1 ? 'bg-red-400' : i === 2 ? 'bg-zinc-400' : 'bg-zinc-700'
                              }`} />
                              <span className="font-bold text-zinc-300 uppercase tracking-wide text-xs">{brand}</span>
                            </div>
                            <span className="font-black text-white">{value} <span className="text-zinc-500">({percent}%)</span></span>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>

            </div>

            {/* Recent Leads Feed */}
            <div className="glass-card p-8 border-white/5 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black uppercase tracking-wider text-white">
                  Últimas Citas Registradas
                </h3>
                <button 
                  onClick={() => setActiveTab('leads')}
                  className="text-xs text-primary font-black uppercase tracking-widest hover:underline cursor-pointer"
                >
                  Ver todas las citas
                </button>
              </div>

              <div className="divide-y divide-white/5">
                {leads.slice(0, 5).map(lead => (
                  <div key={lead.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-white">{lead.nombre}</span>
                        <span className="text-xs text-zinc-500">•</span>
                        <span className="text-xs text-zinc-400 font-bold">{lead.vehiculo}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span className="font-bold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded text-[10px] text-zinc-400 border border-white/5">{lead.servicio}</span>
                        <span>{new Date(lead.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        lead.status === 'Pendiente' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                        lead.status === 'Contactado' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        lead.status === 'En Diagnóstico' ? 'bg-red-500/10 text-primary border border-red-500/20' :
                        lead.status === 'Completado' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        'bg-zinc-800 text-zinc-400 border border-white/5'
                      }`}>
                        {lead.status}
                      </span>
                      
                      <button
                        onClick={() => {
                          setSelectedLead(lead);
                          setNoteEdit(lead.notes || '');
                          setStatusEdit(lead.status);
                        }}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <a
                        href={getWhatsAppContactUrl(lead)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 rounded-lg transition-colors border border-green-500/10"
                        title="Contactar por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                      </a>
                    </div>
                  </div>
                ))}

                {leads.length === 0 && (
                  <p className="text-zinc-500 text-sm py-10 text-center">Aún no se han recibido citas desde el sitio web.</p>
                )}
              </div>
            </div>

          </div>
        )}

        {/* --- TAB: LEADS --- */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Search and Filters Header */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0a0a0a] p-6 rounded-2xl border border-white/5">
              
              {/* Search input */}
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar cliente, vehículo, servicio o teléfono..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-12 pr-6 focus:border-primary outline-none transition-all placeholder:text-zinc-600 text-sm"
                />
              </div>

              {/* Status Filters & Refresh */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                <button
                  onClick={() => token && fetchLeads(token)}
                  className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2"
                  title="Actualizar lista de citas"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLeads ? 'animate-spin' : ''}`} />
                  {isLoadingLeads ? 'Cargando...' : 'Actualizar'}
                </button>

                {['Todos', 'Pendiente', 'Contactado', 'En Diagnóstico', 'Completado', 'Cancelado'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all cursor-pointer ${
                      statusFilter === st 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

            </div>

            {/* Leads Table Container */}
            <div className="glass-card border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5 text-zinc-500 text-[10px] font-black uppercase tracking-wider">
                      <th className="py-4 px-6">Cliente / Datos</th>
                      <th className="py-4 px-6">Vehículo</th>
                      <th className="py-4 px-6">Servicio</th>
                      <th className="py-4 px-6">Fecha Registro</th>
                      <th className="py-4 px-6">Estado</th>
                      <th className="py-4 px-6 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredLeads.map(lead => (
                      <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                        
                        {/* Client details */}
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-black text-white text-base">{lead.nombre}</p>
                            <p className="text-zinc-500 font-bold text-xs tracking-wider">{lead.telefono}</p>
                          </div>
                        </td>

                        {/* Vehicle details */}
                        <td className="py-4 px-6 font-bold text-zinc-300">
                          {lead.vehiculo}
                        </td>

                        {/* Service details */}
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-xs text-zinc-300 uppercase tracking-widest font-black">
                            {lead.servicio}
                          </span>
                        </td>

                        {/* Date details */}
                        <td className="py-4 px-6 text-zinc-400">
                          {lead.fecha_hora ? (
                            <span className="text-primary font-bold block text-xs mb-0.5">
                              📅 {lead.fecha_hora}
                            </span>
                          ) : null}
                          <span className="text-[11px] text-zinc-500">
                            {new Date(lead.created_at).toLocaleString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </td>

                        {/* Status badge */}
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            lead.status === 'Pendiente' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                            lead.status === 'Contactado' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            lead.status === 'En Diagnóstico' ? 'bg-red-500/10 text-primary border border-red-500/20' :
                            lead.status === 'Completado' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            'bg-zinc-800 text-zinc-400 border-white/5'
                          }`}>
                            {lead.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            
                            {/* Edit / Details */}
                            <button
                              onClick={() => {
                                setSelectedLead(lead);
                                setNoteEdit(lead.notes || '');
                                setStatusEdit(lead.status);
                              }}
                              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
                              title="Editar notas / estado"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* WhatsApp Direct */}
                            <a
                              href={getWhatsAppContactUrl(lead)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 rounded-lg transition-colors border border-green-500/10"
                              title="Enviar WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4 fill-current" />
                            </a>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-2 bg-white/5 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-500 transition-colors cursor-pointer border border-white/5"
                              title="Eliminar registro"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))}

                    {filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-zinc-500">
                          {leads.length === 0 ? 'No hay solicitudes de citas en la base de datos.' : 'No se encontraron citas con los filtros aplicados.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* --- TAB: SETTINGS --- */}
        {activeTab === 'settings' && settings && (
          <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
            
            <div className="glass-card p-8 border-white/5">
              <div className="mb-8">
                <h3 className="text-xl font-display font-black uppercase tracking-tight text-white mb-2">
                  Configuración General del Sitio
                </h3>
                <p className="text-zinc-500 text-sm">
                  Modifica los números de contacto, enlaces y textos dinámicos de tu taller sin alterar el código de la landing page.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {/* Contact options */}
                <div className="grid md:grid-cols-2 gap-6 border-b border-white/5 pb-6">
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                      Teléfono de Contacto (Texto)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.PHONE_NUMBER || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, PHONE_NUMBER: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none transition-all text-white text-sm"
                      placeholder="+584123565012"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                      Enlace de WhatsApp (Directo)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.WHATSAPP_LINK || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, WHATSAPP_LINK: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none transition-all text-white text-sm"
                      placeholder="https://wa.link/xxxx"
                    />
                  </div>

                </div>

                {/* Status Toggle & Announcement */}
                <div className="grid md:grid-cols-3 gap-6 border-b border-white/5 pb-6">
                  
                  <div className="space-y-2 col-span-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                      Estado del Taller
                    </label>
                    <select
                      value={settingsForm.IS_OPEN || 'true'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, IS_OPEN: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none transition-all text-white text-sm cursor-pointer"
                    >
                      <option value="true">Abierto (Badge Verde)</option>
                      <option value="false">Cerrado (Badge Amarillo)</option>
                    </select>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                      Anuncio / Texto Banner Superior
                    </label>
                    <input
                      type="text"
                      value={settingsForm.BANNER_TEXT || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, BANNER_TEXT: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none transition-all text-white text-sm"
                      placeholder="Escribe un anuncio para la landing page..."
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                      Plantilla Mensaje de WhatsApp Automático
                    </label>
                    <textarea
                      rows={3}
                      value={settingsForm.WHATSAPP_MESSAGE_TEMPLATE || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, WHATSAPP_MESSAGE_TEMPLATE: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none transition-all text-white text-sm"
                      placeholder="Hola {nombre}, tu {vehiculo} necesita {servicio}..."
                    />
                    <p className="text-[10px] text-zinc-500 ml-4">
                      Variables disponibles: <b>{'{nombre}'}</b>, <b>{'{vehiculo}'}</b>, <b>{'{servicio}'}</b>
                    </p>
                  </div>

                  <div className="space-y-2 col-span-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                      Badge de Cita Exitosa (30% desc)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.SUCCESS_BADGE || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, SUCCESS_BADGE: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none transition-all text-white text-sm"
                      placeholder="¡TIENES UN 30% DE DESCUENTO!"
                    />
                  </div>

                  <div className="space-y-2 col-span-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                      Mensaje de Cita Exitosa (Texto abajo)
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.SUCCESS_TEXT || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, SUCCESS_TEXT: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none transition-all text-white text-sm"
                      placeholder="Un técnico especialista se comunicará contigo vía WhatsApp en breve para coordinar tu descuento y cita."
                    />
                  </div>

                  <div className="space-y-2 col-span-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                      Enlace del Reel de Instagram (Video Principal)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.HERO_REEL_URL || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, HERO_REEL_URL: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none transition-all text-white text-sm"
                      placeholder="https://www.instagram.com/reel/DYQxwH6jywd/"
                    />
                  </div>

                </div>

                {/* Google Maps / Embed integrations */}
                <div className="space-y-6 border-b border-white/5 pb-6">
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                        Enlace de Ubicación (Google Maps)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.GOOGLE_MAPS_LINK || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, GOOGLE_MAPS_LINK: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none transition-all text-white text-sm"
                        placeholder="https://maps.app.goo.gl/..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                        Enlace Ficha Negocio Google (Reviews)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.GOOGLE_BUSINESS_URL || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, GOOGLE_BUSINESS_URL: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none transition-all text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                      Código Iframe Google Maps (Embed src URL)
                    </label>
                    <textarea
                      rows={3}
                      value={settingsForm.GOOGLE_MAPS_EMBED || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, GOOGLE_MAPS_EMBED: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none transition-all text-white text-sm font-mono"
                      placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                  </div>

                </div>

                {/* Images Integrations */}
                <div className="space-y-6 border-b border-white/5 pb-6">
                  <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400">Imágenes y Fotos</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <ImageUploader
                      label="Foto Instalaciones"
                      value={settingsForm.IMG_INSTALACIONES || ''}
                      onChange={(val) => setSettingsForm({ ...settingsForm, IMG_INSTALACIONES: val })}
                      aspectRatio={4 / 3}
                      placeholder="/assets/instalaciones.jpg"
                    />
                    <ImageUploader
                      label="Mecánica General"
                      value={settingsForm.IMG_SRV_MECANICA || ''}
                      onChange={(val) => setSettingsForm({ ...settingsForm, IMG_SRV_MECANICA: val })}
                      aspectRatio={16 / 9}
                      placeholder="/assets/servicio-mecanica.jpg"
                    />
                    <ImageUploader
                      label="Mantenimiento Preventivo"
                      value={settingsForm.IMG_SRV_MANTENIMIENTO || ''}
                      onChange={(val) => setSettingsForm({ ...settingsForm, IMG_SRV_MANTENIMIENTO: val })}
                      aspectRatio={16 / 9}
                    />
                    <ImageUploader
                      label="Electricidad y Electrónica"
                      value={settingsForm.IMG_SRV_ELECTRICIDAD || ''}
                      onChange={(val) => setSettingsForm({ ...settingsForm, IMG_SRV_ELECTRICIDAD: val })}
                      aspectRatio={16 / 9}
                    />
                    <ImageUploader
                      label="Frenos y Suspensión"
                      value={settingsForm.IMG_SRV_FRENOS || ''}
                      onChange={(val) => setSettingsForm({ ...settingsForm, IMG_SRV_FRENOS: val })}
                      aspectRatio={16 / 9}
                    />
                    <ImageUploader
                      label="Inyección Electrónica"
                      value={settingsForm.IMG_SRV_INYECCION || ''}
                      onChange={(val) => setSettingsForm({ ...settingsForm, IMG_SRV_INYECCION: val })}
                      aspectRatio={16 / 9}
                    />
                    <ImageUploader
                      label="Climatización"
                      value={settingsForm.IMG_SRV_CLIMATIZACION || ''}
                      onChange={(val) => setSettingsForm({ ...settingsForm, IMG_SRV_CLIMATIZACION: val })}
                      aspectRatio={16 / 9}
                    />
                    <ImageUploader
                      label="Zona de Lavado"
                      value={settingsForm.IMG_SRV_LAVADO || ''}
                      onChange={(val) => setSettingsForm({ ...settingsForm, IMG_SRV_LAVADO: val })}
                      aspectRatio={16 / 9}
                    />
                  </div>
                </div>

                {/* Servicios del Taller (Dinámico) */}
                <div className="space-y-6 border-b border-white/5 pb-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400">Nuestros Servicios (Añadir y Eliminar)</h4>
                    <button
                      type="button"
                      onClick={() => setServices([...services, { id: Date.now(), title: '', desc: '', img: '' }])}
                      className="text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-xl hover:bg-primary/30 transition-colors font-bold cursor-pointer"
                    >
                      + Añadir Servicio
                    </button>
                  </div>
                  <div className="grid gap-6">
                    {services.map((service, index) => (
                      <div key={service.id || index} className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4 relative">
                        <button
                          type="button"
                          onClick={() => setServices(services.filter((_, i) => i !== index))}
                          className="absolute top-4 right-4 text-zinc-500 hover:text-red-500 transition-colors cursor-pointer"
                          title="Eliminar Servicio"
                        >
                          <X size={18} />
                        </button>
                        <h5 className="text-xs font-black text-primary">SERVICIO {index + 1}</h5>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Nombre del Servicio</label>
                            <input
                              type="text"
                              placeholder="Ej: Mecánica General"
                              value={service.title}
                              onChange={(e) => setServices(services.map((s, i) => i === index ? { ...s, title: e.target.value } : s))}
                              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none text-white text-sm"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Descripción del Servicio</label>
                            <textarea
                              placeholder="Descripción detallada..."
                              value={service.desc}
                              onChange={(e) => setServices(services.map((s, i) => i === index ? { ...s, desc: e.target.value } : s))}
                              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none text-white text-sm resize-y min-h-[80px]"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <ImageUploader
                              label={`Imagen del Servicio (${service.title || `Servicio ${index + 1}`})`}
                              value={service.img}
                              onChange={(val) => setServices(services.map((s, i) => i === index ? { ...s, img: val } : s))}
                              aspectRatio={16 / 9}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {services.length === 0 && (
                    <p className="text-zinc-500 text-xs py-4 text-center">No hay servicios configurados.</p>
                  )}
                </div>

                {/* Textos de Servicios */}
                <div className="space-y-6 border-b border-white/5 pb-6">
                  <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400">Descripciones de Servicios</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {['MECANICA', 'MANTENIMIENTO', 'ELECTRICIDAD', 'FRENOS', 'INYECCION', 'CLIMATIZACION', 'LAVADO'].map(key => (
                      <div key={key} className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                          {key}
                        </label>
                        <textarea
                          value={(settingsForm as any)[`DESC_SRV_${key}`] || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, [`DESC_SRV_${key}`]: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none transition-all text-white text-sm min-h-[100px] resize-y"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Marcas (Dynamic Ticker) */}
                <div className="space-y-6 border-b border-white/5 pb-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400">Marcas de Vehículos (Carrusel)</h4>
                    <button
                      type="button"
                      onClick={() => setBrands([...brands, ''])}
                      className="text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-xl hover:bg-primary/30 transition-colors font-bold cursor-pointer"
                    >
                      + Añadir Marca
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {brands.map((brand, index) => (
                      <div key={index} className="flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-2xl relative group">
                        <input
                          type="text"
                          value={brand}
                          onChange={(e) => setBrands(brands.map((b, i) => i === index ? e.target.value : b))}
                          className="w-full bg-transparent outline-none text-white text-sm font-bold placeholder:text-zinc-700"
                          placeholder="Ej: Toyota"
                        />
                        <button
                          type="button"
                          onClick={() => setBrands(brands.filter((_, i) => i !== index))}
                          className="text-zinc-500 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  {brands.length === 0 && (
                    <p className="text-zinc-500 text-xs py-4 text-center">No hay marcas configuradas para el carrusel.</p>
                  )}
                </div>

                {/* Equipo */}
                <div className="space-y-6 border-b border-white/5 pb-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400">Nuestro Equipo</h4>
                    <button type="button" onClick={() => setTeamMembers([...teamMembers, { id: Date.now(), name: '', role: '', desc: '', img: '' }])} className="text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-xl hover:bg-primary/30 transition-colors font-bold">+ Añadir Miembro</button>
                  </div>
                  <div className="grid gap-6">
                    {teamMembers.map((member, index) => (
                      <div key={member.id || index} className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4 relative">
                        <button type="button" onClick={() => setTeamMembers(teamMembers.filter((_, i) => i !== index))} className="absolute top-4 right-4 text-zinc-500 hover:text-red-500 transition-colors"><X size={18} /></button>
                        <h5 className="text-xs font-black text-primary">MIEMBRO {index + 1}</h5>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Nombre</label>
                            <input type="text" value={member.name} onChange={(e) => setTeamMembers(teamMembers.map((m, i) => i === index ? { ...m, name: e.target.value } : m))} className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none text-white text-sm" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Rol / Cargo</label>
                            <input type="text" value={member.role} onChange={(e) => setTeamMembers(teamMembers.map((m, i) => i === index ? { ...m, role: e.target.value } : m))} className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none text-white text-sm" />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Descripción</label>
                            <textarea value={member.desc} onChange={(e) => setTeamMembers(teamMembers.map((m, i) => i === index ? { ...m, desc: e.target.value } : m))} className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none text-white text-sm resize-y min-h-[80px]" />
                          </div>
                          <div className="md:col-span-2">
                            <ImageUploader label={`Foto Miembro ${index + 1}`} value={member.img} onChange={(val) => setTeamMembers(teamMembers.map((m, i) => i === index ? { ...m, img: val } : m))} aspectRatio={3/4} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reseñas */}
                <div className="space-y-6 border-b border-white/5 pb-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400">Reseñas de Clientes</h4>
                    <button type="button" onClick={() => setReviews([...reviews, { id: Date.now(), name: '', car: '', quote: '' }])} className="text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-xl hover:bg-primary/30 transition-colors font-bold">+ Añadir Reseña</button>
                  </div>
                  <div className="grid gap-6">
                    {reviews.map((review, index) => (
                      <div key={review.id || index} className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4 relative">
                        <button type="button" onClick={() => setReviews(reviews.filter((_, i) => i !== index))} className="absolute top-4 right-4 text-zinc-500 hover:text-red-500 transition-colors"><X size={18} /></button>
                        <h5 className="text-xs font-black text-primary">RESEÑA {index + 1}</h5>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Nombre del Cliente</label>
                            <input type="text" value={review.name} onChange={(e) => setReviews(reviews.map((r, i) => i === index ? { ...r, name: e.target.value } : r))} className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none text-white text-sm" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Vehículo</label>
                            <input type="text" value={review.car} onChange={(e) => setReviews(reviews.map((r, i) => i === index ? { ...r, car: e.target.value } : r))} className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none text-white text-sm" />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Comentario / Reseña</label>
                            <textarea value={review.quote} onChange={(e) => setReviews(reviews.map((r, i) => i === index ? { ...r, quote: e.target.value } : r))} className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none text-white text-sm resize-y min-h-[80px]" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* API Webhooks & Integrations */}
                <div className="space-y-6 border-b border-white/5 pb-6">
                  <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400">Integraciones de Notificaciones (Telegram Bot & Webhook)</h4>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                      URL Webhook Google Sheets
                    </label>
                    <input
                      type="text"
                      value={settingsForm.WEBHOOK_URL || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, WEBHOOK_URL: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none transition-all text-white text-sm font-mono"
                      placeholder="https://script.google.com/macros/s/..."
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                        Telegram Bot Token
                      </label>
                      <input
                        type="text"
                        value={settingsForm.TELEGRAM_BOT_TOKEN || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, TELEGRAM_BOT_TOKEN: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none transition-all text-white text-sm font-mono"
                        placeholder="123456789:ABCdefGHI..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                        Telegram Chat ID (Grupo)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.TELEGRAM_CHAT_ID || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, TELEGRAM_CHAT_ID: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none transition-all text-white text-sm font-mono"
                        placeholder="-100123456789"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                        Telegram Topic ID (Opcional)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.TELEGRAM_TOPIC_ID || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, TELEGRAM_TOPIC_ID: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 focus:border-primary outline-none transition-all text-white text-sm font-mono"
                        placeholder="ID de Tópico"
                      />
                    </div>
                  </div>
                </div>

                {/* Messages & Submit */}
                {settingsSuccessMessage && (
                  <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm font-bold">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{settingsSuccessMessage}</span>
                  </div>
                )}

                {settingsErrorMessage && (
                  <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold">
                    <X className="w-5 h-5 shrink-0" />
                    <span>{settingsErrorMessage}</span>
                  </div>
                )}

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="btn-primary !py-4 px-10 cursor-pointer text-xs uppercase tracking-widest font-black shadow-[0_15px_30px_rgba(229,57,53,0.15)]"
                  >
                    {isSavingSettings ? 'Guardando...' : 'GUARDAR CONFIGURACIONES'}
                  </button>
                </div>

              </form>
            </div>

          </div>
        )}

      </main>

      {/* --- LEAD DETAILS MODAL / DRAWER --- */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="max-w-xl w-full glass-card border-white/10 p-8 shadow-2xl relative">
            
            {/* Close button */}
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 block">
                Ficha del Cliente / Historial
              </span>
              <h3 className="text-2xl font-display font-black uppercase tracking-tight text-white">
                Detalle de Solicitud
              </h3>
            </div>

            {/* Client info box */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Nombre</p>
                  <p className="font-bold text-white flex items-center gap-2"><User size={14} className="text-zinc-500" /> {selectedLead.nombre}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Teléfono</p>
                  <p className="font-bold text-white flex items-center gap-2"><MessageCircle size={14} className="text-green-500" /> {selectedLead.telefono}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Vehículo</p>
                  <p className="font-bold text-white flex items-center gap-2"><Car size={14} className="text-zinc-500" /> {selectedLead.vehiculo}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Servicio</p>
                  <p className="font-bold text-white flex items-center gap-2"><Wrench size={14} className="text-zinc-500" /> {selectedLead.servicio}</p>
                </div>
              </div>

              {selectedLead.fecha_hora && (
                <div className="border-t border-white/5 pt-4">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Fecha y Hora Seleccionada de Cita</p>
                  <p className="font-bold text-white text-sm bg-primary/10 border border-primary/20 p-3 rounded-xl flex items-center gap-2">
                    <Calendar size={16} className="text-primary shrink-0" /> {selectedLead.fecha_hora}
                  </p>
                </div>
              )}

              {(selectedLead.placa || selectedLead.ubicacion || selectedLead.falla) && (
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Placa / Año</p>
                    <p className="font-bold text-white flex items-center gap-2">
                      {selectedLead.placa || 'N/A'} - {selectedLead.anio || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Ubicación</p>
                    <p className="font-bold text-white text-sm truncate" title={selectedLead.ubicacion}>{selectedLead.ubicacion || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Falla Reportada</p>
                    <p className="font-bold text-white text-sm bg-black/20 p-3 rounded-xl border border-white/5">{selectedLead.falla || 'No reportada'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Status and Notes Editing Form */}
            <div className="space-y-4">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                  Estado de Atención
                </label>
                <select
                  value={statusEdit}
                  onChange={(e) => setStatusEdit(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-6 focus:border-primary outline-none transition-all text-white text-sm cursor-pointer"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Contactado">Contactado</option>
                  <option value="En Diagnóstico">En Diagnóstico</option>
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                  Notas de Diagnóstico / Taller (Internas)
                </label>
                <textarea
                  rows={4}
                  value={noteEdit}
                  onChange={(e) => setNoteEdit(e.target.value)}
                  placeholder="Añade notas del mecánico, diagnósticos realizados, repuestos necesarios o cotizaciones..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 focus:border-primary outline-none transition-all text-white text-sm"
                />
              </div>

              <div className="flex gap-3 pt-4">
                
                {/* Contact button */}
                <a
                  href={getWhatsAppContactUrl(selectedLead)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} className="fill-current" /> Contactar WhatsApp
                </a>

                {/* Save button */}
                <button
                  disabled={isUpdatingLead}
                  onClick={() => handleUpdateLead(selectedLead.id)}
                  className="px-8 py-3.5 bg-primary hover:bg-red-600 text-white rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                >
                  {isUpdatingLead ? 'Guardando...' : <Check size={16} />} Guardar Ficha
                </button>
                
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Global CSS for Animations and Custom Scrollbar */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
