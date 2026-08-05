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
  Check,
  Save,
  Loader2,
  Plus,
  Tag,
  Package,
  Layers,
  Bot,
  HelpCircle,
  Users,
  Star
} from 'lucide-react';
import ImageUploader from './components/ImageUploader';

const DEFAULT_SERVICES = [
  { id: 1, title: "Mecánica General", desc: "Reparación profunda de motores, sustitución de embragues y solución de fallas mecánicas complejas con repuestos de alta calidad.", img: "/assets/servicio-mecanica.jpg" },
  { id: 2, title: "Mantenimiento Preventivo", desc: "Cambios de aceite sintético, reemplazo de filtros y fluidos esenciales para alargar la vida útil de tu motor.", img: "/24214142.png" },
  { id: 3, title: "Electricidad y Electrónica", desc: "Diagnóstico computarizado, reparación de alternadores, arranques y corrección de cableado y módulos electrónicos.", img: "/assets/servicio-electricidad.jpg" },
  { id: 4, title: "Frenos y Suspensión", desc: "Cambio de pastillas, rectificación de discos, reemplazo de amortiguadores y ajuste completo de tren delantero.", img: "/assets/servicio-frenos.jpg" },
  { id: 5, title: "Inyección Electrónica", desc: "Limpieza ultrasónica de inyectores, diagnóstico de bombas de gasolina y optimización del consumo de combustible.", img: "/assets/servicio-inyeccion.jpg" },
  { id: 6, title: "Climatización", desc: "Carga de gas refrigerante, detección de fugas y mantenimiento completo del sistema de aire acondicionado.", img: "/assets/servicio-climatizacion.jpg" },
  { id: 7, title: "Zona de Lavado", desc: "Lavado detallado de carrocería, limpieza profunda de motor e interior para entregar tu vehículo impecable.", img: "/assets/instalaciones.jpg" }
];

const DEFAULT_FAQS = [
  { q: "¿Cuánto tiempo toma un mantenimiento preventivo básico?", a: "El tiempo estimado oscila entre 45 minutos y 1 hora y media, dependiendo del plan de servicio requerido. Durante la intervención, puede esperar cómodamente en nuestra área Lounge VIP, equipada con estación de café y conectividad Wi-Fi de alta velocidad." },
  { q: "¿Tienen garantía los trabajos que realizan?", a: "Absolutamente. Todos nuestros servicios están respaldados por la Garantía Total MasterTech. Cubrimos la mano de obra calificada y los componentes o consumibles suministrados en nuestras instalaciones, asegurando un estándar óptimo de durabilidad y rendimiento." },
  { q: "¿Cómo agendo una cita para mi vehículo?", a: "Puede gestionar su cita en tiempo real de dos formas: directamente desde nuestra plataforma web haciendo clic en el botón \"Reserva Ahora\", o comunicándose directamente con nuestro equipo de asesores de servicio vía WhatsApp." },
  { q: "¿Cuáles son los métodos de pago aceptados?", a: "Para su comodidad, disponemos de múltiples canales de pago: Pago Móvil, transferencias bancarias nacionales e internacionales, efectivo (USD/EUR) y Zelle." },
  { q: "¿Qué tipo de herramientas o tecnología utilizan para el diagnóstico?", a: "Contamos con equipos de diagnóstico computarizado y escáneres multimarca de última generación. Esto nos permite interactuar con los módulos electrónicos del vehículo, analizar datos en tiempo real y detectar fallas con precisión quirúrgica antes de cualquier reparación." },
  { q: "¿Puedo dejar mi vehículo en el taller si la reparación toma varios días?", a: "Sí. Disponemos de instalaciones cerradas con sistemas de seguridad activa y monitoreo para resguardar su vehículo si requiere procedimientos mecánicos o electrónicos complejos que extiendan el tiempo de entrega." },
  { q: "¿Me informan antes de realizar algún trabajo adicional en mi vehículo?", a: "Totalmente. Mantenemos una política de cero sorpresas. Si durante la inspección o diagnóstico detectamos alguna anomalía extra, nuestro asesor de servicio le enviará un reporte técnico detallado junto al presupuesto correspondiente para su aprobación previa por WhatsApp antes de proceder." }
];

const DEFAULT_TEAM = [
  { id: 1, name: 'Jesús M.', role: 'Jefe de Mecánica', desc: 'Experto en diagnóstico avanzado y reparación de motores con más de 15 años de experiencia multimarca.', img: '/jesus.jpg' },
  { id: 2, name: 'Miguel A.', role: 'Especialista en Electrónica', desc: 'Ingeniero automotriz dedicado a la resolución de fallas eléctricas complejas y reprogramación de módulos.', img: '/assets/instalaciones.jpg' },
  { id: 3, name: 'Ana P.', role: 'Asesora de Servicio', desc: 'Encargada de la recepción, atención personalizada y seguimiento continuo del estatus de tu vehículo.', img: '/assets/instalaciones.jpg' }
];

const DEFAULT_REVIEWS = [
  { id: 1, name: 'Carlos R.', car: 'Jeep Grand Cherokee', quote: 'Excelente servicio técnico. Diagnosticaron una falla eléctrica en mi Cherokee que otros talleres no lograban descifrar. Transparencia total.' },
  { id: 2, name: 'Mariana G.', car: 'Toyota Fortuner', quote: 'El cambio de aceite y mantenimiento de frenos fue rápido y con repuestos 100% originales. La atención de la asesora excelente.' },
  { id: 3, name: 'Roberto V.', car: 'Honda CR-V', quote: 'Impecable trabajo en la reconstrucción del motor y climatización. Quedó enfriando perfecto. Muy recomendados en Porlamar.' }
];

export interface CatalogItem {
  id: number;
  title: string;
  category: string;
  price: string;
  desc: string;
  longDesc?: string;
  img: string;
  badge?: string;
  specs?: string[];
  compatibility?: string;
  partNumber?: string;
}

const DEFAULT_CATALOG: CatalogItem[] = [
  {
    id: 1,
    title: "Kit Aceite Sintético Motor 5W-30 + Filtro de Aceite OEM",
    category: "Aceites y Lubricantes",
    price: "$45.00",
    desc: "Aceite 100% sintético de alto rendimiento con aditivos antidesgaste de última generación. Incluye filtro de aceite de especificación original.",
    longDesc: "Formulación avanzada que reduce el rozamiento térmico en motores modernos. Protege componentes internos durante arranques en frío y prolonga la vida útil del bloque.",
    img: "/24214142.png",
    badge: "Más Vendido",
    specs: ["Sintético API SP / ILSAC GF-6A", "Incluye filtro de aceite OEM", "Soporta altas temperaturas de motor"],
    compatibility: "Jeep, Toyota, Honda, Nissan, Dodge, Lexus, Hyundai, Kia",
    partNumber: "NP-SYN-5W30-OEM"
  },
  {
    id: 2,
    title: "Pastillas de Freno Cerámicas Premium (Juego Delantero/Trasero)",
    category: "Frenos y Suspensión",
    price: "$55.00",
    desc: "Pastillas cerámicas de baja emisión de polvo, frenado silencioso y máximo agarre térmico para SUVs, 4x4 y sedanes.",
    longDesc: "Fabricadas con fibras cerámicas avanzadas que previenen chirridos metálicos y disminuyen el desgaste de los discos de freno.",
    img: "/assets/servicio-frenos.jpg",
    badge: "Garantía MasterTech",
    specs: ["Compuesto 100% cerámico antidesgaste", "Libre de ruidos y polvo metálico", "Resistencia superior a 600°C"],
    compatibility: "Vehículos Japoneses, Americanos y Coreanos",
    partNumber: "NP-BP-CER-8842"
  },
  {
    id: 3,
    title: "Batería Automotriz Libre de Mantenimiento 600A / 700A",
    category: "Baterías y Electricidad",
    price: "$85.00",
    desc: "Batería sellada de aleación plata-calcio de alta resistencia para arranques inmediatos en clima tropical.",
    longDesc: "Diseñada para responder a altas exigencias eléctricas de sistemas multimedia, iluminación LED y aire acondicionado.",
    img: "/assets/instalaciones.jpg",
    badge: "Garantía 12 Meses",
    specs: ["Sellada libre de mantenimiento", "Alta capacidad de arranque en frío (CCA)", "Placas reforzadas contra corrosión"],
    compatibility: "Modelos estándar y Heavy Duty",
    partNumber: "BT-MF-600A-MT"
  },
  {
    id: 4,
    title: "Kit de Filtro de Aire de Motor + Filtro de Aire de Cabina A/A",
    category: "Filtros y Consumibles",
    price: "$30.00",
    desc: "Filtros de celulosa y carbón activado que bloquean polvo, polen y partículas finas antes de entrar al motor y cabina.",
    longDesc: "Mantén el aire limpio dentro del vehículo y optimiza la aspiración del motor para asegurar una mezcla de combustión eficiente.",
    img: "/assets/servicio-inyeccion.jpg",
    badge: "Filtro Carbón Activado",
    specs: ["Eficiencia de filtrado >99%", "Protege inyectores y flujo de aire", "Elimina malos olores en cabina"],
    compatibility: "Amplio stock disponible para todas las marcas",
    partNumber: "FLT-KIT-AIR-441"
  },
  {
    id: 5,
    title: "Gas Refrigerante R134a Sintético + Aceite PAG con Tinte UV",
    category: "Fluidos y Refrigeración",
    price: "$35.00",
    desc: "Refrigerante ecológico R134a de máxima pureza con trazador fluorescente UV para detección rápida de fugas.",
    longDesc: "Relleno especializado para compresores de aire acondicionado que restaura el rendimiento de congelamiento óptimo.",
    img: "/assets/servicio-climatizacion.jpg",
    badge: "Frío Garantizado",
    specs: ["Refrigerante R134a 100% puro", "Aceite PAG para lubricación del compresor", "Incluye aditivo detector de fugas UV"],
    compatibility: "Sistemas A/A automotrices R134a",
    partNumber: "GAS-R134A-UV"
  },
  {
    id: 6,
    title: "Juego de Amortiguadores Reforzados Gas/Hidráulicos (Par)",
    category: "Frenos y Suspensión",
    price: "$120.00",
    desc: "Amortiguadores de doble tubo presurizados con nitrógeno para estabilidad superior en terreno irregular.",
    longDesc: "Absorben impactos y vibraciones del camino, manteniendo los neumáticos firmemente adheridos al asfalto en curvas exigentes.",
    img: "/assets/servicio-mecanica.jpg",
    badge: "Resistencia Heavy-Duty",
    specs: ["Presurización por gas nitrógeno", "Vástago cromado ultrarresistente", "Retenes de baja fricción"],
    compatibility: "SUVs, Pick-ups 4x4 y Camionetas",
    partNumber: "AMR-HD-9082-GAS"
  },
  {
    id: 7,
    title: "Kit de Microfiltros, O-Rings y Sellos para Inyectores de Gasolina",
    category: "Filtros y Consumibles",
    price: "$25.00",
    desc: "Microfiltros de mella fina de cobre y juntas o-rings de vitón resistentes a la gasolina y altas temperaturas.",
    longDesc: "Reemplazo preventivo en mantenimiento de inyectores para evitar fugas de combustible y atascos de suciedad en la aguja de inyección.",
    img: "/assets/servicio-inyeccion.jpg",
    badge: "Vitón de Alta Presión",
    specs: ["O-rings en material Vitón", "Microfiltros sintéticos lavables", "Previene fugas y goteo de combustible"],
    compatibility: "Inyectores Bosch, Denso, Delphi, Magneti Marelli",
    partNumber: "INJ-O-RING-VITON"
  },
  {
    id: 8,
    title: "Kit Champú Neutro Concentrado + Cera Sintética Protectora",
    category: "Cuidado y Estética",
    price: "$20.00",
    desc: "Champú PH neutro espumoso y cera sintética con polímeros hidrofóbicos que repelen agua y polvo de la pintura.",
    longDesc: "Protege la pintura contra rayos UV, excrementos de aves y lluvia ácida, aportando un brillo cristalino duradero.",
    img: "/assets/instalaciones.jpg",
    badge: "Efecto Espejo",
    specs: ["Polímeros sintéticos selladores", "Protección UV de carrocería", "Biodegradable de fácil enjuague"],
    compatibility: "Apto para todo tipo de pintura y barniz",
    partNumber: "CAR-DET-CERA-PH"
  }
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
  fecha_hora?: string;
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
  IS_OPEN: string;
  BANNER_TEXT: string;
  WHATSAPP_MESSAGE_TEMPLATE?: string;
  SUCCESS_BADGE?: string;
  SUCCESS_TEXT?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  TELEGRAM_TOPIC_ID?: string;
  CATALOG_PRODUCTS_JSON?: string;
  [key: string]: any;
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
  
  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'catalogo' | 'settings' | 'contenido' | 'integraciones'>('dashboard');
  const [contentSubTab, setContentSubTab] = useState<'servicios' | 'faqs' | 'equipo' | 'testimonios'>('servicios');

  // Dynamic Data
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(DEFAULT_CATALOG);
  const [teamMembers, setTeamMembers] = useState<any[]>(DEFAULT_TEAM);
  const [reviews, setReviews] = useState<any[]>(DEFAULT_REVIEWS);
  const [services, setServices] = useState<any[]>(DEFAULT_SERVICES);
  const [faqs, setFaqs] = useState<any[]>(DEFAULT_FAQS);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  // Modal States
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [noteEdit, setNoteEdit] = useState('');
  const [statusEdit, setStatusEdit] = useState('');
  const [isUpdatingLead, setIsUpdatingLead] = useState(false);

  // Catalog Item Edit Modal
  const [editingProduct, setEditingProduct] = useState<CatalogItem | null>(null);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  // Settings Edit State
  const [settingsForm, setSettingsForm] = useState<Partial<Settings>>({});
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccessMessage, setSettingsSuccessMessage] = useState('');
  const [settingsErrorMessage, setSettingsErrorMessage] = useState('');

  // Fetch Leads
  const fetchLeads = async (authToken: string) => {
    setIsLoadingLeads(true);
    let apiLeads: any[] = [];
    try {
      const res = await fetch('/api/leads', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        apiLeads = await res.json();
      }
    } catch (e) {}

    let localLeads: any[] = [];
    try {
      const stored = localStorage.getItem('mastertech_leads_store');
      if (stored) localLeads = JSON.parse(stored);
    } catch (e) {}

    const leadMap = new Map<string, any>();
    for (const lead of localLeads) {
      if (lead && lead.id) leadMap.set(String(lead.id), lead);
    }
    for (const lead of apiLeads) {
      if (lead && lead.id) leadMap.set(String(lead.id), lead);
    }

    const merged = Array.from(leadMap.values()).sort(
      (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );

    setLeads(merged);
    try { localStorage.setItem('mastertech_leads_store', JSON.stringify(merged.slice(0, 100))); } catch (e) {}
    setIsLoadingLeads(false);
  };

  // Fetch Settings
  const fetchSettings = async () => {
    setIsLoadingSettings(true);
    let localData: any = null;
    try {
      const stored = localStorage.getItem('mastertech_settings_store');
      if (stored) localData = JSON.parse(stored);
    } catch (e) {}

    if (localData) {
      setSettings(localData);
      setSettingsForm(localData);
      try { if (localData.CATALOG_PRODUCTS_JSON) setCatalogItems(JSON.parse(localData.CATALOG_PRODUCTS_JSON)); } catch (e) {}
      try { if (localData.TEAM_MEMBERS_JSON) setTeamMembers(JSON.parse(localData.TEAM_MEMBERS_JSON)); } catch (e) {}
      try { if (localData.REVIEWS_JSON) setReviews(JSON.parse(localData.REVIEWS_JSON)); } catch (e) {}
      try { if (localData.SERVICES_JSON) setServices(JSON.parse(localData.SERVICES_JSON)); } catch (e) {}
      try { if (localData.FAQS_JSON) setFaqs(JSON.parse(localData.FAQS_JSON)); } catch (e) {}
    }

    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        const merged = { ...localData, ...data };
        if (merged.SUCCESS_BADGE && merged.SUCCESS_BADGE.includes('30%')) {
          merged.SUCCESS_BADGE = '¡TIENES HASTA UN 15% DE DESCUENTO!';
        }
        setSettings(merged);
        setSettingsForm(merged);

        try {
          if (merged.CATALOG_PRODUCTS_JSON) {
            setCatalogItems(JSON.parse(merged.CATALOG_PRODUCTS_JSON));
          } else if (!localData?.CATALOG_PRODUCTS_JSON) {
            setCatalogItems(DEFAULT_CATALOG);
          }
        } catch (e) {}

        try {
          if (merged.TEAM_MEMBERS_JSON) {
            setTeamMembers(JSON.parse(merged.TEAM_MEMBERS_JSON));
          } else {
            setTeamMembers(DEFAULT_TEAM);
          }
        } catch (e) {
          setTeamMembers(DEFAULT_TEAM);
        }

        try {
          if (merged.REVIEWS_JSON) {
            setReviews(JSON.parse(merged.REVIEWS_JSON));
          } else {
            setReviews(DEFAULT_REVIEWS);
          }
        } catch (e) {
          setReviews(DEFAULT_REVIEWS);
        }
        try { if (merged.FAQS_JSON) setFaqs(JSON.parse(merged.FAQS_JSON)); } catch (e) {}
        try { if (merged.SERVICES_JSON) setServices(JSON.parse(merged.SERVICES_JSON)); } catch (e) {}
        try { localStorage.setItem('mastertech_settings_store', JSON.stringify(merged)); } catch (e) {}
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLeads(token);
      fetchSettings();
    }
  }, [token]);

  // Auth Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('mastertech_admin_token', data.token);
        setToken(data.token);
      } else {
        setAuthError(data.error || 'Contraseña incorrecta.');
      }
    } catch (err) {
      setAuthError('Error de conexión al servidor.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mastertech_admin_token');
    setToken(null);
  };

  // Lead Operations
  const handleUpdateLead = async (id: number) => {
    if (!token) return;
    setIsUpdatingLead(true);

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: statusEdit, notes: noteEdit })
      });

      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: statusEdit, notes: noteEdit } : l));
        setSelectedLead(null);
      } else {
        alert('Error al actualizar la cita.');
      }
    } catch (err) {
      alert('Error de conexión al actualizar la cita.');
    } finally {
      setIsUpdatingLead(false);
    }
  };

  const handleDeleteLead = async (id: number) => {
    if (!token || !window.confirm('¿Estás seguro de eliminar este registro de cita?')) return;

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setLeads(prev => prev.filter(l => l.id !== id));
        if (selectedLead?.id === id) setSelectedLead(null);
      }
    } catch (err) {
      alert('Error al eliminar el registro.');
    }
  };

  // Save Settings
  const handleSaveSettings = async (overrideForm?: any) => {
    if (!token) return;
    setIsSavingSettings(true);
    setSettingsSuccessMessage('');
    setSettingsErrorMessage('');

    const targetForm = overrideForm || settingsForm;
    if (targetForm.SUCCESS_BADGE && targetForm.SUCCESS_BADGE.includes('30%')) {
      targetForm.SUCCESS_BADGE = '¡TIENES HASTA UN 15% DE DESCUENTO!';
    }

    // Always persist to local storage first so user changes take effect immediately
    try { localStorage.setItem('mastertech_settings_store', JSON.stringify(targetForm)); } catch (e) {}
    setSettings(targetForm);
    setSettingsForm(targetForm);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(targetForm)
      });

      if (res.status === 401) {
        localStorage.removeItem('mastertech_admin_token');
        setToken(null);
        setAuthError('Tu sesión ha expirado. Ingresa tu contraseña para ingresar al panel.');
        return;
      }

      if (res.ok) {
        const data = await res.json();
        const updated = data.settings || targetForm;
        setSettings(updated);
        setSettingsForm(updated);
        try { localStorage.setItem('mastertech_settings_store', JSON.stringify(updated)); } catch (e) {}
        setSettingsSuccessMessage('¡Cambios guardados e integrados correctamente!');
        setTimeout(() => setSettingsSuccessMessage(''), 4000);
      } else {
        setSettingsSuccessMessage('¡Cambios guardados localmente!');
        setTimeout(() => setSettingsSuccessMessage(''), 4000);
      }
    } catch (err) {
      setSettingsSuccessMessage('¡Cambios guardados localmente!');
      setTimeout(() => setSettingsSuccessMessage(''), 4000);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Catalog CRUD Operations
  const handleSaveCatalogItem = (product: CatalogItem) => {
    let updatedCatalog: CatalogItem[] = [];
    if (product.id && catalogItems.some(p => p.id === product.id)) {
      updatedCatalog = catalogItems.map(p => p.id === product.id ? product : p);
    } else {
      const newProduct = { ...product, id: Date.now() };
      updatedCatalog = [newProduct, ...catalogItems];
    }

    setCatalogItems(updatedCatalog);
    const updatedForm = { ...settingsForm, CATALOG_PRODUCTS_JSON: JSON.stringify(updatedCatalog) };
    setSettingsForm(updatedForm);
    setIsCatalogModalOpen(false);
    setEditingProduct(null);
    handleSaveSettings(updatedForm);
  };

  const handleDeleteCatalogItem = (id: number) => {
    if (!window.confirm('¿Eliminar este repuesto o servicio del catálogo?')) return;
    const updatedCatalog = catalogItems.filter(p => p.id !== id);
    setCatalogItems(updatedCatalog);
    const updatedForm = { ...settingsForm, CATALOG_PRODUCTS_JSON: JSON.stringify(updatedCatalog) };
    setSettingsForm(updatedForm);
    handleSaveSettings(updatedForm);
  };

  // Filtered Leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      (lead.nombre || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.telefono || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.vehiculo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.servicio || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Metrics
  const totalLeads = leads.length;
  const pendingLeads = leads.filter(l => l.status === 'Pendiente').length;
  const contactedLeads = leads.filter(l => l.status === 'Contactado').length;
  const diagLeads = leads.filter(l => l.status === 'En Diagnóstico').length;
  const completedLeads = leads.filter(l => l.status === 'Completado').length;

  const getWhatsAppContactUrl = (lead: Lead) => {
    const text = `Hola *${lead.nombre}*, te saludamos de *Taller MasterTech* 🛠️. Nos comunicamos en relación a tu solicitud de cita para *${lead.servicio}* de tu vehículo *${lead.vehiculo}*.`;
    return `https://wa.me/${lead.telefono.replace(/\+/g, '')}?text=${encodeURIComponent(text)}`;
  };

  // Login Screen
  if (!token) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6 selection:bg-primary selection:text-white">
        <div className="glass-card max-w-md w-full p-8 border-white/10 space-y-6 relative overflow-hidden">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto text-primary mb-4">
              <Lock size={28} />
            </div>
            <h2 className="text-2xl font-display font-black uppercase tracking-tight text-white">Panel de Administración</h2>
            <p className="text-zinc-500 text-xs">Acceso seguro para el equipo de Taller MasterTech</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-2">Contraseña Admin</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-5 text-white outline-none focus:border-primary text-sm transition-all"
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full btn-primary !py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-none"
            >
              {isAuthenticating ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
              <span>Ingresar al Sistema</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full text-zinc-500 hover:text-white text-xs font-bold py-2 transition-colors flex items-center justify-center gap-1"
            >
              <ArrowLeft size={14} /> Volver a la web
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col selection:bg-primary selection:text-white pb-24">
      
      {/* Top Main Navbar */}
      <header className="bg-[#0d0e12] border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          
          {/* Brand Logo & Shop Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={settingsForm.LOGO_URL || "/logo.png"} alt="MasterTech" className="h-8 w-auto" />
              <span className="text-xs font-black uppercase tracking-widest text-primary hidden sm:inline">PANEL ADMIN</span>
            </div>

            <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[11px] font-bold">
              <span className={`w-2 h-2 rounded-full ${settingsForm.IS_OPEN !== 'false' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-zinc-300">{settingsForm.IS_OPEN !== 'false' ? 'Taller Abierto' : 'Taller Cerrado'}</span>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none max-w-full">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'dashboard' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity size={14} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'leads' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar size={14} />
              <span>Citas ({totalLeads})</span>
            </button>

            <button
              onClick={() => setActiveTab('catalogo')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'catalogo' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Package size={14} />
              <span>Catálogo Repuestos</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'settings' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <SettingsIcon size={14} />
              <span>Ajustes Web</span>
            </button>

            <button
              onClick={() => setActiveTab('contenido')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'contenido' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers size={14} />
              <span>Contenido & Servicios</span>
            </button>

            <button
              onClick={() => setActiveTab('integraciones')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'integraciones' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bot size={14} />
              <span>Integraciones</span>
            </button>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-xs font-bold text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl flex items-center gap-1.5 border border-white/10 transition-colors"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">Ver Web</span>
            </button>

            <button
              onClick={handleLogout}
              className="text-xs font-bold text-zinc-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-3.5 py-2 rounded-xl flex items-center gap-1.5 border border-white/10 transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        
        {/* ========================================================================= */}
        {/* TAB 1: DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="glass-card p-6 border-white/5 relative overflow-hidden">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Total Solicitudes</p>
                <div className="text-4xl font-black text-white">{totalLeads}</div>
              </div>

              <div className="glass-card p-6 border-white/5 relative overflow-hidden">
                <p className="text-[10px] font-bold text-yellow-500/80 uppercase tracking-widest mb-2">Pendientes</p>
                <div className="text-4xl font-black text-yellow-500">{pendingLeads}</div>
              </div>

              <div className="glass-card p-6 border-white/5 relative overflow-hidden">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Contactados</p>
                <div className="text-4xl font-black text-blue-400">{contactedLeads}</div>
              </div>

              <div className="glass-card p-6 border-white/5 relative overflow-hidden">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">En Diagnóstico</p>
                <div className="text-4xl font-black text-primary">{diagLeads}</div>
              </div>

              <div className="glass-card p-6 border-white/5 relative overflow-hidden col-span-2 lg:col-span-1">
                <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-2">Completadas</p>
                <div className="text-4xl font-black text-green-400">{completedLeads}</div>
              </div>
            </div>

            {/* Recent Leads */}
            <div className="glass-card p-6 border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Últimas Solicitudes Registradas</h3>
                <button 
                  onClick={() => setActiveTab('leads')}
                  className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                >
                  <span>Ver todas las citas</span>
                  <ExternalLink size={12} />
                </button>
              </div>

              <div className="divide-y divide-white/5">
                {leads.slice(0, 5).map(lead => (
                  <div key={lead.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-bold text-white">{lead.nombre} ({lead.telefono})</p>
                      <p className="text-zinc-400">{lead.vehiculo} - <span className="text-primary font-bold">{lead.servicio}</span></p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-zinc-300">
                      {lead.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CITAS (LEADS) */}
        {/* ========================================================================= */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-fade-in">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#12141a] p-4 sm:p-6 rounded-2xl border border-white/10">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar cliente, vehículo, servicio o teléfono..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 focus:border-primary outline-none text-xs text-white placeholder:text-zinc-600"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={() => token && fetchLeads(token)}
                  className="px-3.5 py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RefreshCw size={14} className={isLoadingLeads ? 'animate-spin' : ''} />
                  <span>Actualizar</span>
                </button>

                {['Todos', 'Pendiente', 'Contactado', 'En Diagnóstico', 'Completado', 'Cancelado'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      statusFilter === st ? 'bg-primary text-white border-primary' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Leads Table */}
            <div className="glass-card border-white/10 overflow-hidden rounded-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-6">Cliente / Teléfono</th>
                      <th className="py-3.5 px-6">Vehículo</th>
                      <th className="py-3.5 px-6">Servicio</th>
                      <th className="py-3.5 px-6">Fecha Registro</th>
                      <th className="py-3.5 px-6">Estado</th>
                      <th className="py-3.5 px-6 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {filteredLeads.map(lead => (
                      <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-6 font-bold text-white">
                          <div>{lead.nombre}</div>
                          <div className="text-zinc-400 font-normal">{lead.telefono}</div>
                        </td>
                        <td className="py-4 px-6 text-zinc-300 font-semibold">{lead.vehiculo}</td>
                        <td className="py-4 px-6"><span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-primary font-bold">{lead.servicio}</span></td>
                        <td className="py-4 px-6 text-zinc-400">
                          {lead.fecha_hora && <div className="text-primary font-bold mb-0.5">📅 {lead.fecha_hora}</div>}
                          <div>{new Date(lead.created_at).toLocaleString('es-ES')}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-white/5 border border-white/10 text-zinc-300">
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => { setSelectedLead(lead); setNoteEdit(lead.notes || ''); setStatusEdit(lead.status); }}
                              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-300 hover:text-white border border-white/10"
                              title="Editar Ficha"
                            >
                              <Edit size={14} />
                            </button>
                            <a
                              href={getWhatsAppContactUrl(lead)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg border border-green-500/20"
                              title="Contactar WhatsApp"
                            >
                              <MessageCircle size={14} />
                            </a>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-2 bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-lg border border-white/10"
                              title="Eliminar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CATÁLOGO DE REPUESTOS & SERVICIOS (NEW DEDICATED MANAGEMENT SPACE!) */}
        {/* ========================================================================= */}
        {activeTab === 'catalogo' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#12141a] p-6 rounded-2xl border border-white/10">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                  <Package className="text-primary" size={22} />
                  <span>Gestión del Catálogo de Repuestos y Productos</span>
                </h2>
                <p className="text-zinc-400 text-xs mt-1">
                  Agrega, edita o elimina repuestos, aceites y consumibles automotrices visibles en la página <strong className="text-white">/catalogo</strong>.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct({
                    id: 0,
                    title: "",
                    category: "Aceites y Lubricantes",
                    price: "$0.00",
                    desc: "",
                    longDesc: "",
                    img: "/assets/instalaciones.jpg",
                    badge: "Garantía MasterTech",
                    specs: [],
                    compatibility: "Todos los vehículos"
                  });
                  setIsCatalogModalOpen(true);
                }}
                className="btn-primary !py-2.5 !px-5 text-xs border-none flex items-center gap-2 shrink-0 shadow-lg"
              >
                <Plus size={16} />
                <span>Agregar Nuevo Repuesto</span>
              </button>
            </div>

            {/* Catalog Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalogItems.map((item) => (
                <div key={item.id} className="bg-[#12141a] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between group">
                  <div className="relative aspect-[16/9] bg-black overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-2 left-2 bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-bold px-2 py-0.5 rounded-full text-zinc-300">
                      {item.category}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-black/90 border border-primary/40 text-primary font-bold text-xs px-2.5 py-0.5 rounded-full">
                      {item.price}
                    </span>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white text-sm leading-snug">{item.title}</h3>
                      <p className="text-zinc-400 text-xs line-clamp-2 mt-1">{item.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(item);
                          setIsCatalogModalOpen(true);
                        }}
                        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit size={14} />
                        <span>Editar</span>
                      </button>

                      <button
                        onClick={() => handleDeleteCatalogItem(item.id)}
                        className="bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/10 p-2 rounded-xl transition-colors"
                        title="Eliminar del catálogo"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: AJUSTES WEB (HERO, CONTACTO, ESTADO) */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="bg-[#12141a] p-6 rounded-2xl border border-white/10 space-y-6">
              <h2 className="text-lg font-bold uppercase tracking-tight text-white flex items-center gap-2 border-b border-white/10 pb-4">
                <SettingsIcon className="text-primary" size={20} />
                <span>Ajustes Principales del Sitio Web</span>
              </h2>

              {/* Hero Image & Reel */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary">1. Fondo Hero, Logo & Video</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <ImageUploader
                    label="Imagen de Fondo Principal (Hero)"
                    value={settingsForm.HERO_IMG || ''}
                    onChange={(val) => setSettingsForm({ ...settingsForm, HERO_IMG: val })}
                    aspectRatio={16 / 9}
                    placeholder="/assets/hero_bg_custom.jpg"
                  />
                  <ImageUploader
                    label="Logo Oficial del Taller"
                    value={settingsForm.LOGO_URL || ''}
                    onChange={(val) => setSettingsForm({ ...settingsForm, LOGO_URL: val })}
                    aspectRatio={1 / 1}
                    placeholder="/logo.png"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                    URL Embed de Reel Instagram / Video Promocional
                  </label>
                  <input
                    type="text"
                    value={settingsForm.HERO_REEL_URL || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, HERO_REEL_URL: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-xs font-bold text-white outline-none focus:border-primary"
                    placeholder="https://www.instagram.com/reel/C.../embed"
                  />
                </div>
              </div>

              {/* Contact numbers */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary">2. Teléfono & Canales Directos</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Teléfono de Contacto (Texto)</label>
                    <input
                      type="text"
                      value={settingsForm.PHONE_NUMBER || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, PHONE_NUMBER: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-xs font-bold text-white outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Enlace Directo de WhatsApp</label>
                    <input
                      type="text"
                      value={settingsForm.WHATSAPP_LINK || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, WHATSAPP_LINK: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-xs font-bold text-white outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Status and Banner */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary">3. Estado del Taller & Distintivos</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Estado Operativo del Taller</label>
                    <select
                      value={settingsForm.IS_OPEN || 'true'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, IS_OPEN: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-xs font-bold text-white outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="true">Abierto (Badge Verde)</option>
                      <option value="false">Cerrado (Badge Rojo)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Badge de Cita Exitosa</label>
                    <input
                      type="text"
                      value={settingsForm.SUCCESS_BADGE || '¡TIENES HASTA UN 15% DE DESCUENTO!'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, SUCCESS_BADGE: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-xs font-bold text-white outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: CONTENIDO & SERVICIOS */}
        {/* ========================================================================= */}
        {activeTab === 'contenido' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Sub-tab navigation */}
            <div className="flex items-center gap-2 bg-[#12141a] p-2 rounded-2xl border border-white/10 overflow-x-auto">
              <button
                onClick={() => setContentSubTab('servicios')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  contentSubTab === 'servicios' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Servicios ({services.length})
              </button>

              <button
                onClick={() => setContentSubTab('equipo')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  contentSubTab === 'equipo' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Equipo / Personal ({teamMembers.length})
              </button>

              <button
                onClick={() => setContentSubTab('testimonios')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  contentSubTab === 'testimonios' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Testimonios ({reviews.length})
              </button>

              <button
                onClick={() => setContentSubTab('faqs')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  contentSubTab === 'faqs' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Preguntas Frecuentes ({faqs.length})
              </button>
            </div>

            {/* Sub-tab: Servicios */}
            {contentSubTab === 'servicios' && (
              <div className="bg-[#12141a] p-6 rounded-2xl border border-white/10 space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wider">Gestión de Servicios de Taller</h3>
                    <p className="text-xs text-zinc-400 mt-1">Edita el título, la descripción y sube o modifica la imagen oficial de cada servicio.</p>
                  </div>
                  <button
                    onClick={() => {
                      const updated = [...services, { id: Date.now(), title: "Nuevo Servicio", desc: "Descripción del servicio...", img: "/assets/instalaciones.jpg" }];
                      setServices(updated);
                      setSettingsForm({ ...settingsForm, SERVICES_JSON: JSON.stringify(updated) });
                    }}
                    className="btn-primary !py-2 !px-4 text-xs border-none flex items-center gap-1 shrink-0"
                  >
                    <Plus size={14} />
                    <span>Agregar Servicio</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {services.map((srv, idx) => (
                    <div key={srv.id || idx} className="p-5 bg-black/40 rounded-2xl border border-white/10 space-y-4">
                      <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Título del Servicio #{idx + 1}</label>
                          <input
                            type="text"
                            value={srv.title}
                            onChange={(e) => {
                              const titleVal = e.target.value;
                              const updated = [...services];
                              updated[idx].title = titleVal;
                              setServices(updated);
                              setSettingsForm({ ...settingsForm, SERVICES_JSON: JSON.stringify(updated) });
                            }}
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-primary"
                          />
                        </div>

                        <button
                          onClick={() => {
                            if (!window.confirm(`¿Eliminar el servicio "${srv.title}"?`)) return;
                            const updated = services.filter((_, i) => i !== idx);
                            setServices(updated);
                            setSettingsForm({ ...settingsForm, SERVICES_JSON: JSON.stringify(updated) });
                          }}
                          className="text-zinc-500 hover:text-red-400 p-2 border border-white/5 rounded-xl bg-white/5"
                          title="Eliminar Servicio"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Image Uploader & Preview */}
                      <div>
                        <ImageUploader
                          label={`Imagen de ${srv.title || `Servicio #${idx + 1}`}`}
                          value={srv.img || ''}
                          onChange={(val) => {
                            const updated = [...services];
                            updated[idx].img = val;
                            setServices(updated);

                            const newForm = { ...settingsForm, SERVICES_JSON: JSON.stringify(updated) };
                            let key = '';
                            if (srv.title.includes('Mecánica')) key = 'MECANICA';
                            else if (srv.title.includes('Mantenimiento')) key = 'MANTENIMIENTO';
                            else if (srv.title.includes('Electricidad')) key = 'ELECTRICIDAD';
                            else if (srv.title.includes('Frenos')) key = 'FRENOS';
                            else if (srv.title.includes('Inyección')) key = 'INYECCION';
                            else if (srv.title.includes('Climatización')) key = 'CLIMATIZACION';
                            else if (srv.title.includes('Lavado')) key = 'LAVADO';

                            if (key) newForm[`IMG_SRV_${key}`] = val;
                            setSettingsForm(newForm);
                          }}
                          aspectRatio={16 / 9}
                          placeholder="/assets/servicio-mecanica.jpg"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Descripción del Servicio</label>
                        <textarea
                          rows={3}
                          value={srv.desc}
                          onChange={(e) => {
                            const descVal = e.target.value;
                            const updated = [...services];
                            updated[idx].desc = descVal;
                            setServices(updated);

                            const newForm = { ...settingsForm, SERVICES_JSON: JSON.stringify(updated) };
                            let key = '';
                            if (srv.title.includes('Mecánica')) key = 'MECANICA';
                            else if (srv.title.includes('Mantenimiento')) key = 'MANTENIMIENTO';
                            else if (srv.title.includes('Electricidad')) key = 'ELECTRICIDAD';
                            else if (srv.title.includes('Frenos')) key = 'FRENOS';
                            else if (srv.title.includes('Inyección')) key = 'INYECCION';
                            else if (srv.title.includes('Climatización')) key = 'CLIMATIZACION';
                            else if (srv.title.includes('Lavado')) key = 'LAVADO';

                            if (key) newForm[`DESC_SRV_${key}`] = descVal;
                            setSettingsForm(newForm);
                          }}
                          className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-tab: Equipo */}
            {contentSubTab === 'equipo' && (
              <div className="bg-[#12141a] p-6 rounded-2xl border border-white/10 space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wider">Gestión del Equipo de Trabajo</h3>
                    <p className="text-xs text-zinc-400 mt-1">Edita los nombres, cargos, descripciones y fotos del personal visibles en la página <strong className="text-white">/nosotros</strong>.</p>
                  </div>
                  <button
                    onClick={() => {
                      const updated = [...teamMembers, { id: Date.now(), name: "Nuevo Miembro", role: "Especialista", desc: "Descripción...", img: "/assets/instalaciones.jpg" }];
                      setTeamMembers(updated);
                      setSettingsForm({ ...settingsForm, TEAM_MEMBERS_JSON: JSON.stringify(updated) });
                    }}
                    className="btn-primary !py-2 !px-4 text-xs border-none flex items-center gap-1 shrink-0"
                  >
                    <Plus size={14} />
                    <span>Agregar Miembro</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {teamMembers.map((member, idx) => (
                    <div key={member.id || idx} className="p-5 bg-black/40 rounded-2xl border border-white/10 space-y-4">
                      <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Nombre</label>
                            <input
                              type="text"
                              value={member.name || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                const updated = [...teamMembers];
                                updated[idx].name = val;
                                setTeamMembers(updated);

                                const newForm = { ...settingsForm, TEAM_MEMBERS_JSON: JSON.stringify(updated) };
                                if (idx === 0) newForm.TEAM_1_NAME = val;
                                if (idx === 1) newForm.TEAM_2_NAME = val;
                                if (idx === 2) newForm.TEAM_3_NAME = val;
                                setSettingsForm(newForm);
                              }}
                              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-primary"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Cargo / Especialidad</label>
                            <input
                              type="text"
                              value={member.role || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                const updated = [...teamMembers];
                                updated[idx].role = val;
                                setTeamMembers(updated);

                                const newForm = { ...settingsForm, TEAM_MEMBERS_JSON: JSON.stringify(updated) };
                                if (idx === 0) newForm.TEAM_1_ROLE = val;
                                if (idx === 1) newForm.TEAM_2_ROLE = val;
                                if (idx === 2) newForm.TEAM_3_ROLE = val;
                                setSettingsForm(newForm);
                              }}
                              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-primary"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (!window.confirm(`¿Eliminar a "${member.name}" del equipo?`)) return;
                            const updated = teamMembers.filter((_, i) => i !== idx);
                            setTeamMembers(updated);
                            setSettingsForm({ ...settingsForm, TEAM_MEMBERS_JSON: JSON.stringify(updated) });
                          }}
                          className="text-zinc-500 hover:text-red-400 p-2 border border-white/5 rounded-xl bg-white/5 self-end"
                          title="Eliminar Miembro"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Image Uploader */}
                      <div>
                        <ImageUploader
                          label={`Foto de ${member.name || `Miembro #${idx + 1}`}`}
                          value={member.img || ''}
                          onChange={(val) => {
                            const updated = [...teamMembers];
                            updated[idx].img = val;
                            setTeamMembers(updated);

                            const newForm = { ...settingsForm, TEAM_MEMBERS_JSON: JSON.stringify(updated) };
                            if (idx === 0) newForm.TEAM_1_IMG = val;
                            if (idx === 1) newForm.TEAM_2_IMG = val;
                            if (idx === 2) newForm.TEAM_3_IMG = val;
                            setSettingsForm(newForm);
                          }}
                          aspectRatio={1}
                          placeholder="/assets/instalaciones.jpg"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Perfil / Biografía</label>
                        <textarea
                          rows={2}
                          value={member.desc || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = [...teamMembers];
                            updated[idx].desc = val;
                            setTeamMembers(updated);

                            const newForm = { ...settingsForm, TEAM_MEMBERS_JSON: JSON.stringify(updated) };
                            if (idx === 0) newForm.TEAM_1_DESC = val;
                            if (idx === 1) newForm.TEAM_2_DESC = val;
                            if (idx === 2) newForm.TEAM_3_DESC = val;
                            setSettingsForm(newForm);
                          }}
                          className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-tab: Testimonios */}
            {contentSubTab === 'testimonios' && (
              <div className="bg-[#12141a] p-6 rounded-2xl border border-white/10 space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wider">Gestión de Testimonios y Reseñas</h3>
                    <p className="text-xs text-zinc-400 mt-1">Edita las opiniones de clientes visibles en la página principal.</p>
                  </div>
                  <button
                    onClick={() => {
                      const updated = [...reviews, { id: Date.now(), name: "Nombre Cliente", car: "Modelo Vehículo", quote: "Excelente atención y diagnóstico preciso." }];
                      setReviews(updated);
                      setSettingsForm({ ...settingsForm, REVIEWS_JSON: JSON.stringify(updated) });
                    }}
                    className="btn-primary !py-2 !px-4 text-xs border-none flex items-center gap-1 shrink-0"
                  >
                    <Plus size={14} />
                    <span>Agregar Testimonio</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {reviews.map((rev, idx) => (
                    <div key={rev.id || idx} className="p-5 bg-black/40 rounded-2xl border border-white/10 space-y-4">
                      <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Nombre Cliente</label>
                            <input
                              type="text"
                              value={rev.name || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                const updated = [...reviews];
                                updated[idx].name = val;
                                setReviews(updated);

                                const newForm = { ...settingsForm, REVIEWS_JSON: JSON.stringify(updated) };
                                if (idx === 0) newForm.REV_1_NAME = val;
                                if (idx === 1) newForm.REV_2_NAME = val;
                                if (idx === 2) newForm.REV_3_NAME = val;
                                setSettingsForm(newForm);
                              }}
                              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-primary"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Vehículo del Cliente</label>
                            <input
                              type="text"
                              value={rev.car || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                const updated = [...reviews];
                                updated[idx].car = val;
                                setReviews(updated);

                                const newForm = { ...settingsForm, REVIEWS_JSON: JSON.stringify(updated) };
                                if (idx === 0) newForm.REV_1_CAR = val;
                                if (idx === 1) newForm.REV_2_CAR = val;
                                if (idx === 2) newForm.REV_3_CAR = val;
                                setSettingsForm(newForm);
                              }}
                              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-primary"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (!window.confirm(`¿Eliminar reseña de "${rev.name}"?`)) return;
                            const updated = reviews.filter((_, i) => i !== idx);
                            setReviews(updated);
                            setSettingsForm({ ...settingsForm, REVIEWS_JSON: JSON.stringify(updated) });
                          }}
                          className="text-zinc-500 hover:text-red-400 p-2 border border-white/5 rounded-xl bg-white/5 self-end"
                          title="Eliminar Reseña"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Testimonial Quote */}
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Testimonio / Opinión</label>
                        <textarea
                          rows={2}
                          value={rev.quote || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = [...reviews];
                            updated[idx].quote = val;
                            setReviews(updated);

                            const newForm = { ...settingsForm, REVIEWS_JSON: JSON.stringify(updated) };
                            if (idx === 0) newForm.REV_1_QUOTE = val;
                            if (idx === 1) newForm.REV_2_QUOTE = val;
                            if (idx === 2) newForm.REV_3_QUOTE = val;
                            setSettingsForm(newForm);
                          }}
                          className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {contentSubTab === 'faqs' && (
              <div className="bg-[#12141a] p-6 rounded-2xl border border-white/10 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">Preguntas Frecuentes</h3>
                  <button
                    onClick={() => {
                      const updated = [...faqs, { q: "Nueva Pregunta", a: "Respuesta de la pregunta." }];
                      setFaqs(updated);
                      setSettingsForm({ ...settingsForm, FAQS_JSON: JSON.stringify(updated) });
                    }}
                    className="btn-primary !py-2 !px-4 text-xs border-none flex items-center gap-1"
                  >
                    <Plus size={14} />
                    <span>Agregar FAQ</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={faq.q}
                          onChange={(e) => {
                            const updated = [...faqs];
                            updated[idx].q = e.target.value;
                            setFaqs(updated);
                            setSettingsForm({ ...settingsForm, FAQS_JSON: JSON.stringify(updated) });
                          }}
                          className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs font-bold text-white outline-none focus:border-primary"
                        />
                        <button
                          onClick={() => {
                            const updated = faqs.filter((_, i) => i !== idx);
                            setFaqs(updated);
                            setSettingsForm({ ...settingsForm, FAQS_JSON: JSON.stringify(updated) });
                          }}
                          className="ml-2 text-zinc-500 hover:text-red-400 p-2"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={faq.a}
                        onChange={(e) => {
                          const updated = [...faqs];
                          updated[idx].a = e.target.value;
                          setFaqs(updated);
                          setSettingsForm({ ...settingsForm, FAQS_JSON: JSON.stringify(updated) });
                        }}
                        className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-300 outline-none focus:border-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: INTEGRACIONES (TELEGRAM, WEBHOOK, MAPAS) */}
        {/* ========================================================================= */}
        {activeTab === 'integraciones' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="bg-[#12141a] p-6 rounded-2xl border border-white/10 space-y-6">
              <h2 className="text-lg font-bold uppercase tracking-tight text-white flex items-center gap-2 border-b border-white/10 pb-4">
                <Bot className="text-primary" size={20} />
                <span>Integraciones de Notificaciones & Sistema</span>
              </h2>

              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary">Telegram Bot Notificador</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Telegram Bot Token</label>
                    <input
                      type="text"
                      value={settingsForm.TELEGRAM_BOT_TOKEN || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, TELEGRAM_BOT_TOKEN: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-xs font-mono text-white outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Telegram Chat ID (Grupo)</label>
                    <input
                      type="text"
                      value={settingsForm.TELEGRAM_CHAT_ID || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, TELEGRAM_CHAT_ID: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-xs font-mono text-white outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Telegram Topic ID (Opcional)</label>
                    <input
                      type="text"
                      value={settingsForm.TELEGRAM_TOPIC_ID || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, TELEGRAM_TOPIC_ID: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-xs font-mono text-white outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary">Webhook Google Sheets</h3>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">URL Webhook Script</label>
                  <input
                    type="text"
                    value={settingsForm.WEBHOOK_URL || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, WEBHOOK_URL: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-xs font-mono text-white outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Floating Save Bar for Settings/Content/Integrations */}
      {['settings', 'contenido', 'integraciones'].includes(activeTab) && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#12141a]/95 backdrop-blur-xl border border-white/20 p-3.5 rounded-full shadow-2xl flex items-center gap-4">
          {settingsSuccessMessage && (
            <span className="text-xs font-bold text-green-400 flex items-center gap-1 pl-2">
              <CheckCircle2 size={16} />
              <span>{settingsSuccessMessage}</span>
            </span>
          )}
          {settingsErrorMessage && (
            <span className="text-xs font-bold text-red-400 flex items-center gap-1 pl-2">
              <AlertCircle size={16} />
              <span>{settingsErrorMessage}</span>
            </span>
          )}
          <button
            onClick={() => handleSaveSettings()}
            disabled={isSavingSettings}
            className="btn-primary !py-2.5 !px-6 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-none shadow-lg"
          >
            {isSavingSettings ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            <span>Guardar Cambios</span>
          </button>
        </div>
      )}

      {/* Catalog Product Edit/Create Modal */}
      {isCatalogModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#12141a] border border-white/20 rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto scrollbar-none">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white uppercase">{editingProduct.id ? 'Editar Repuesto / Producto' : 'Nuevo Repuesto / Producto'}</h3>
              <button onClick={() => setIsCatalogModalOpen(false)} className="text-zinc-400 hover:text-white"><X size={18} /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Título del Repuesto / Producto</label>
                  <input
                    type="text"
                    value={editingProduct.title}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Número de Parte (Part Number / OEM)</label>
                  <input
                    type="text"
                    value={editingProduct.partNumber || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, partNumber: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-mono outline-none focus:border-primary"
                    placeholder="OEM #52088898AD"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Categoría</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="Aceites y Lubricantes">Aceites y Lubricantes</option>
                    <option value="Frenos y Suspensión">Frenos y Suspensión</option>
                    <option value="Filtros y Consumibles">Filtros y Consumibles</option>
                    <option value="Baterías y Electricidad">Baterías y Electricidad</option>
                    <option value="Fluidos y Refrigeración">Fluidos y Refrigeración</option>
                    <option value="Cuidado y Estética">Cuidado y Estética</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Precio Referencia</label>
                  <input
                    type="text"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-primary"
                    placeholder="$45.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Badge Promocional</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-primary"
                    placeholder="Más Vendido"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Compatibilidad</label>
                  <input
                    type="text"
                    value={editingProduct.compatibility || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, compatibility: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-primary"
                    placeholder="Jeep, Toyota, Honda..."
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 font-bold block mb-1">Imagen (URL o Subir)</label>
                <ImageUploader
                  label=""
                  value={editingProduct.img}
                  onChange={(val) => setEditingProduct({ ...editingProduct, img: val })}
                  aspectRatio={16 / 9}
                  placeholder="/assets/servicio-frenos.jpg"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-bold block mb-1">Descripción Corta</label>
                <textarea
                  rows={2}
                  value={editingProduct.desc}
                  onChange={(e) => setEditingProduct({ ...editingProduct, desc: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-bold block mb-1">Descripción Técnica / Detalles</label>
                <textarea
                  rows={3}
                  value={editingProduct.longDesc || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, longDesc: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
              <button
                onClick={() => setIsCatalogModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleSaveCatalogItem(editingProduct)}
                className="btn-primary !py-2 !px-5 text-xs border-none"
              >
                Guardar Repuesto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#12141a] border border-white/20 rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto scrollbar-none">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white uppercase">Ficha de Cita #{selectedLead.id}</h3>
              <button onClick={() => setSelectedLead(null)} className="text-zinc-400 hover:text-white"><X size={18} /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2">
                <p><strong>Cliente:</strong> {selectedLead.nombre}</p>
                <p><strong>Teléfono:</strong> {selectedLead.telefono}</p>
                <p><strong>Vehículo:</strong> {selectedLead.vehiculo}</p>
                <p><strong>Servicio:</strong> {selectedLead.servicio}</p>
                {selectedLead.fecha_hora && <p className="text-primary"><strong>Fecha Cita:</strong> {selectedLead.fecha_hora}</p>}
                {selectedLead.falla && <p><strong>Falla Reportada:</strong> {selectedLead.falla}</p>}
              </div>

              <div>
                <label className="text-zinc-400 font-bold block mb-1">Estado de Atención</label>
                <select
                  value={statusEdit}
                  onChange={(e) => setStatusEdit(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-primary cursor-pointer"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Contactado">Contactado</option>
                  <option value="En Diagnóstico">En Diagnóstico</option>
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 font-bold block mb-1">Notas Internas</label>
                <textarea
                  rows={4}
                  value={noteEdit}
                  onChange={(e) => setNoteEdit(e.target.value)}
                  placeholder="Notas del diagnóstico..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
              <button onClick={() => setSelectedLead(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white">Cerrar</button>
              <button onClick={() => handleUpdateLead(selectedLead.id)} className="btn-primary !py-2 !px-5 text-xs border-none">Guardar Ficha</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
