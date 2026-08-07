import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './Navbar';
import { ChevronLeft, Search, Tag, Filter, CheckCircle2, ShieldCheck, ArrowRight, ExternalLink, Package, X, Wrench, Plane, Send, Car, User, MapPin, ShoppingCart, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CONFIG_DEFAULT = {
  PHONE_NUMBER: "+584123565012",
  WHATSAPP_LINK: "https://wa.link/xnj37f",
  LOGO_URL: "/logo.png",
  INSTAGRAM_LINK: "https://www.instagram.com/tallermastertech/",
  TIKTOK_LINK: "https://www.tiktok.com/@tallermastertech",
};

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
  stock?: number;
  isImportedUSA?: boolean;
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
    partNumber: "NP-SYN-5W30-OEM",
    stock: 15,
    isImportedUSA: true
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
    partNumber: "NP-BP-CER-8842",
    stock: 8,
    isImportedUSA: true
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
    partNumber: "BT-MF-600A-MT",
    stock: 6,
    isImportedUSA: false
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
    partNumber: "FLT-KIT-AIR-441",
    stock: 12,
    isImportedUSA: true
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
    partNumber: "GAS-R134A-UV",
    stock: 20,
    isImportedUSA: true
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
    partNumber: "AMR-HD-9082-GAS",
    stock: 4,
    isImportedUSA: true
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
    partNumber: "INJ-O-RING-VITON",
    stock: 25,
    isImportedUSA: true
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
    partNumber: "CAR-DET-CERA-PH",
    stock: 10,
    isImportedUSA: false
  }
];

const CATEGORIES = [
  "Todos",
  "Aceites y Lubricantes",
  "Frenos y Suspensión",
  "Filtros y Consumibles",
  "Baterías y Electricidad",
  "Fluidos y Refrigeración",
  "Cuidado y Estética"
];

export interface CartItem {
  product: CatalogItem;
  quantity: number;
}

export default function Catalogo() {
  const [config, setConfig] = useState<any>(CONFIG_DEFAULT);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(DEFAULT_CATALOG);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<CatalogItem | null>(null);

  // USA Import Order Form Modal State
  const [isUsaModalOpen, setIsUsaModalOpen] = useState(false);
  const [usaForm, setUsaForm] = useState({
    partNumber: '',
    productName: '',
    brand: '',
    model: '',
    year: '',
    engine: '',
    vin: '',
    clientName: '',
    phone: '',
    location: 'Porlamar, Isla de Margarita',
    shippingMode: 'Express Aéreo (3 a 5 días hábiles)',
    notes: ''
  });
  const [isSubmittingUsa, setIsSubmittingUsa] = useState(false);
  const [usaFormSubmitted, setUsaFormSubmitted] = useState(false);

  // Interactive Shopping Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mastertech_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartClient, setCartClient] = useState({
    name: '',
    phone: '',
    vehicle: '',
    location: 'Porlamar, Isla de Margarita',
    notes: ''
  });
  const [isSubmittingCart, setIsSubmittingCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('mastertech_cart_items', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  const addToCart = (product: CatalogItem, qty: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const updateCartQty = (productId: number, delta: number) => {
    setCart((prev) => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getItemQuantity = (productId: number): number => {
    const item = cart.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const parsePrice = (priceStr: string): number => {
    const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const cartTotalAmount = useMemo(() => {
    return cart.reduce((acc, item) => acc + (parsePrice(item.product.price) * item.quantity), 0);
  }, [cart]);

  const cartTotalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const handleSendCartOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsSubmittingCart(true);

    const itemsText = cart.map((item, index) => {
      const subtotal = (parsePrice(item.product.price) * item.quantity).toFixed(2);
      const partStr = item.product.partNumber ? ` (N° OEM: #${item.product.partNumber})` : '';
      return `${index + 1}. *${item.product.title}*
   • Cantidad: _${item.quantity} unidades_ ${partStr}
   • Subtotal: _$${subtotal} USD_`;
    }).join('\n\n');

    const clientNameStr = cartClient.name || 'Cliente MasterTech';
    const clientPhoneStr = cartClient.phone || 'No indicado';
    const clientVehicleStr = cartClient.vehicle || 'Por especificar';

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: clientNameStr,
          telefono: clientPhoneStr,
          vehiculo: clientVehicleStr,
          servicio: `Pedido Carrito (${cartTotalItems} piezas - Total: $${cartTotalAmount.toFixed(2)})`,
          status: 'Pendiente',
          notes: `[SOLICITUD CARRITO DE REPUESTOS]\nTotal: $${cartTotalAmount.toFixed(2)} USD\nItems:\n${cart.map(i => `- ${i.quantity}x ${i.product.title} (#${i.product.partNumber || 'N/A'})`).join('\n')}`
        })
      });
    } catch (err) {}

    const waMessage = `🛒 *SOLICITUD DE PEDIDO - CARRITO DE REPUESTOS*
_MasterTech Automotriz - Cotización Multielemento_

📌 *DETALLE DE REPUESTOS SOLICITADOS (${cartTotalItems} PIEZAS):*
-----------------------------------------
${itemsText}

-----------------------------------------
📊 *RESUMEN DEL PEDIDO:*
• Total de Piezas: _${cartTotalItems} unidades_
• *MONTO TOTAL ESTIMADO:* *$${cartTotalAmount.toFixed(2)} USD*

👤 *DATOS DEL CLIENTE:*
• *Nombre:* _${clientNameStr}_
• *Teléfono:* _${clientPhoneStr}_
• *Vehículo:* _${clientVehicleStr}_
• *Ubicación:* _${cartClient.location}_

💬 *NOTAS ADICIONALES:*
_${cartClient.notes || 'Ninguna.'}_

---
_Hola equipo Taller MasterTech 🛠️, quisiera procesar este pedido de repuestos de mi carrito. Quedo a la espera de la confirmación de disponibilidad en taller._`;

    const targetUrl = buildDirectWhatsAppUrl(config.PHONE_NUMBER, waMessage);
    setIsSubmittingCart(false);
    setCartSuccess(true);
    window.open(targetUrl, '_blank');
  };

  useEffect(() => {
    document.title = "Catálogo de Repuestos y Productos - Taller MasterTech";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Catálogo de repuestos originales, aceites sintéticos, baterías y componentes para tu vehículo en Taller MasterTech Porlamar.');
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('import') === 'usa' || window.location.hash.includes('solicitud-usa')) {
      setIsUsaModalOpen(true);
    }

    let localData: any = null;
    try {
      const stored = localStorage.getItem('mastertech_settings_store');
      if (stored) localData = JSON.parse(stored);
    } catch (e) {}

    if (localData) {
      setConfig((prev: any) => ({ ...prev, ...localData }));
      try {
        if (localData.CATALOG_PRODUCTS_JSON) {
          setCatalogItems(JSON.parse(localData.CATALOG_PRODUCTS_JSON));
        }
      } catch (e) {}
    }

    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          let currentLocal: any = null;
          try {
            const stored = localStorage.getItem('mastertech_settings_store');
            if (stored) currentLocal = JSON.parse(stored);
          } catch (e) {}

          const merged = { ...(currentLocal || {}), ...data };
          setConfig((prev: any) => ({ ...prev, ...merged }));
          try {
            localStorage.setItem('mastertech_settings_store', JSON.stringify(merged));
            if (data.CATALOG_PRODUCTS_JSON) {
              setCatalogItems(JSON.parse(data.CATALOG_PRODUCTS_JSON));
            }
          } catch (e) {}
        }
      } catch (err) {}
    };

    fetchSettings();
  }, []);

  const getCleanPhoneDigits = (phoneStr?: string): string => {
    if (!phoneStr) return "584123565012";
    const digits = phoneStr.replace(/\D/g, '');
    return digits.length > 5 ? digits : "584123565012";
  };

  const buildDirectWhatsAppUrl = (phoneStr: string | undefined, textMessage: string): string => {
    const phone = getCleanPhoneDigits(phoneStr);
    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(textMessage)}`;
  };

  const handleUsaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingUsa(true);

    const partText = usaForm.partNumber ? ` (N° Parte OEM: ${usaForm.partNumber})` : '';
    const vehicleText = `${usaForm.brand} ${usaForm.model} ${usaForm.year} ${usaForm.engine}`.trim();

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: usaForm.clientName || 'Cliente Importación EE.UU.',
          telefono: usaForm.phone || 'Sin número',
          vehiculo: vehicleText || 'Vehículo Especial USA',
          servicio: `Importación EE.UU.: ${usaForm.productName}${partText}`,
          status: 'Pendiente',
          notes: `[PEDIDO ESPECIAL EE.UU.] N° Parte: ${usaForm.partNumber || 'N/A'} | VIN: ${usaForm.vin || 'N/A'} | Envío: ${usaForm.shippingMode} | Ubicación: ${usaForm.location} | Notas: ${usaForm.notes}`
        })
      });
    } catch (err) {}

    const waMessage = `🇺🇸 *SOLICITUD DE IMPORTACIÓN DIRECTA EE.UU.*
_MasterTech Automotriz - Pedido Especial OEM_

📌 *DATOS DEL REPUESTO*
• *Pieza / Repuesto:* _${usaForm.productName || 'Pieza Especial OEM'}_
• *N° OEM / Código:* _${usaForm.partNumber || 'Por verificar'}_

🚗 *DATOS DEL VEHÍCULO*
• *Vehículo:* _${vehicleText || 'No especificado'}_
• *Serial VIN (Chasis):* _${usaForm.vin || 'No indicado'}_

👤 *DATOS DEL CLIENTE*
• *Nombre:* _${usaForm.clientName || 'Cliente MasterTech'}_
• *Teléfono:* _${usaForm.phone || 'No indicado'}_
• *Ubicación:* _${usaForm.location || 'Porlamar, Margarita'}_
• *Logística:* _${usaForm.shippingMode}_

💬 *NOTAS ADICIONALES*
_${usaForm.notes || 'Sin observaciones adicionales.'}_

---
_Hola equipo Taller MasterTech 🛠️, he completado el formulario web. Quedo a la espera de la cotización formal en USD puesta en taller y tiempo exacto de entrega._`;

    const targetWaUrl = buildDirectWhatsAppUrl(config.PHONE_NUMBER, waMessage);

    setIsSubmittingUsa(false);
    setUsaFormSubmitted(true);
    window.open(targetWaUrl, '_blank');
  };

  const filteredItems = useMemo(() => {
    return catalogItems.filter(item => {
      const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory;
      const matchesSearch = searchQuery.trim() === "" || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.partNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [catalogItems, selectedCategory, searchQuery]);

  const getWhatsAppMessage = (productName: string, price: string, partNumber?: string, isImportedUSA?: boolean, stock?: number) => {
    const partInfo = partNumber ? ` (N° Parte OEM: ${partNumber})` : '';
    let text = '';
    if (stock === 0 || isImportedUSA) {
      text = `🇺🇸 *CONSULTA DE REPUESTO IMPORTADO DESDE EE.UU.*\n\n📦 *Pieza:* _${productName}_${partInfo}\n💵 *Precio estimado:* _${price}_\n\n_Hola Taller MasterTech 🛠️, quisiera consultar tiempos de importación directa y costo total puesto en taller._`;
    } else {
      text = `📦 *CONSULTA DE REPUESTO EN STOCK*\n\n📦 *Pieza:* _${productName}_${partInfo}\n💵 *Precio publicado:* _${price}_\n\n_Hola Taller MasterTech 🛠️, me interesa comprar este repuesto. ¿Puedo coordinar el retiro o la instalación en taller?_`;
    }
    return buildDirectWhatsAppUrl(config.PHONE_NUMBER, text);
  };

  return (
    <div className="min-h-screen bg-[#141b21] text-[#e6ebf0] selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar activePage="catalogo" config={config} />

      {/* Main Container */}
      <main className="pt-28 pb-20 max-w-[1760px] mx-auto px-3 sm:px-6">
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 text-primary font-bold text-xs uppercase tracking-widest"
          >
            <Package size={14} />
            <span>Repuestos Certificados & Importación USA 🇺🇸</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-black tracking-tight mb-4 uppercase"
          >
            Catálogo de <span className="text-primary italic">Repuestos & Consumibles</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-sm sm:text-base leading-relaxed"
          >
            Explora nuestro inventario en taller de lubricantes sintéticos, filtros, pastillas de freno, baterías e inyectores. Traemos repuestos importados directamente desde EE.UU. para tu vehículo.
          </motion.p>
        </div>

        {/* Search & Category Filter Control Bar */}
        <div className="space-y-4 mb-10">
          {/* Search Box & Cart Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text"
                placeholder="Buscar por repuesto, marca, número de parte OEM (ej. #52088898AD)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#12141a] border border-white/15 focus:border-primary rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition-all shadow-xl"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full sm:w-auto bg-primary/20 hover:bg-primary text-primary hover:text-white border border-primary/40 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shrink-0"
            >
              <div className="relative">
                <ShoppingCart size={16} />
                {cartTotalItems > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-white text-black font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {cartTotalItems}
                  </span>
                )}
              </div>
              <span>Mi Carrito {cartTotalItems > 0 ? `($${cartTotalAmount.toFixed(2)})` : ''}</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none justify-start sm:justify-center">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected 
                      ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' 
                      : 'bg-white/5 text-zinc-400 border border-white/10 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {cat === "Todos" && <Filter size={12} />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl max-w-md mx-auto">
            <Package size={40} className="mx-auto text-zinc-500 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No encontramos coincidencias</h3>
            <p className="text-zinc-400 text-xs px-6 mb-6">Prueba seleccionando otra categoría de repuesto o busca un término más general.</p>
            <button 
              onClick={() => { setSelectedCategory("Todos"); setSearchQuery(""); }}
              className="btn-primary !py-2 !px-5 text-xs border-none"
            >
              Ver Todo el Catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-7 gap-2.5 sm:gap-3.5">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="bg-[#12141a]/95 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all flex flex-col group shadow-md relative hover:shadow-xl hover:shadow-primary/10"
              >
                {/* Product Image Box */}
                <div className="relative aspect-square bg-black overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(item)}>
                  <img 
                    src={item.img} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12141a] via-transparent to-black/30" />

                  {/* Category Pill */}
                  <span className="absolute top-1.5 left-1.5 bg-black/80 backdrop-blur-md border border-white/15 text-[8px] font-bold px-1.5 py-0.5 rounded text-zinc-300 truncate max-w-[70%]">
                    {item.category}
                  </span>

                  {/* USA Badge if present */}
                  {item.isImportedUSA && (
                    <span className="absolute top-1.5 right-1.5 bg-blue-600/90 backdrop-blur-md text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow border border-blue-400/30">
                      🇺🇸 USA
                    </span>
                  )}

                  {/* Price Tag */}
                  <div className="absolute bottom-1.5 right-1.5 bg-black/90 backdrop-blur-md border border-primary/40 text-primary font-black text-[11px] px-1.5 py-0.5 rounded shadow">
                    {item.price}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-2.5 flex-1 flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1">
                      {item.partNumber && (
                        <span className="text-[8.5px] font-mono font-bold text-zinc-400 bg-white/5 border border-white/10 px-1 py-0.5 rounded truncate max-w-full">
                          #{item.partNumber}
                        </span>
                      )}
                      
                      <span className={`text-[8.5px] font-bold px-1 py-0.5 rounded ${
                        (item.stock ?? 10) > 0 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {(item.stock ?? 10) > 0 ? `🟢 Stock` : '🔴 USA 🇺🇸'}
                      </span>
                    </div>

                    <h3 
                      onClick={() => setSelectedProduct(item)}
                      className="text-[11px] font-bold text-white group-hover:text-primary transition-colors cursor-pointer leading-snug line-clamp-2 min-h-[2.2em]"
                      title={item.title}
                    >
                      {item.title}
                    </h3>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-1.5 space-y-1 border-t border-white/5">
                    {getItemQuantity(item.id) === 0 ? (
                      <button
                        onClick={() => addToCart(item, 1)}
                        className="w-full bg-primary/20 hover:bg-primary text-primary hover:text-white border border-primary/40 text-[10px] font-bold py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                      >
                        <ShoppingCart size={12} />
                        <span>+ Agregar al Carrito</span>
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-primary/20 border border-primary/50 rounded-lg p-1 text-[10px]">
                        <button
                          onClick={() => updateCartQty(item.id, -1)}
                          className="w-5 h-5 rounded bg-black/60 hover:bg-primary text-white flex items-center justify-center font-black cursor-pointer transition-colors"
                          title="Restar 1 unidad"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="font-bold text-white px-1 flex items-center gap-1 text-[10px]">
                          <ShoppingCart size={11} className="text-primary" />
                          <span>{getItemQuantity(item.id)} en carrito</span>
                        </span>
                        <button
                          onClick={() => updateCartQty(item.id, 1)}
                          className="w-5 h-5 rounded bg-black/60 hover:bg-primary text-white flex items-center justify-center font-black cursor-pointer transition-colors"
                          title="Sumar 1 unidad"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-1">
                      <a
                        href={getWhatsAppMessage(item.title, item.price, item.partNumber, item.isImportedUSA, item.stock)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-zinc-300 hover:text-white text-[9px] font-bold py-1 px-1.5 text-center flex items-center justify-center gap-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer"
                        title="Consultar por WhatsApp este repuesto directo"
                      >
                        <WhatsAppIcon size={10} />
                        <span className="truncate">Directo</span>
                      </a>

                      <button
                        onClick={() => setSelectedProduct(item)}
                        className="w-full text-zinc-400 hover:text-white text-[9px] font-bold py-1 text-center flex items-center justify-center gap-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <span>Ficha</span>
                        <ArrowRight size={9} className="text-primary" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Custom Part Quote Help Section */}
        <div className="mt-20 bg-gradient-to-r from-red-950/40 via-[#12141a] to-blue-950/40 border border-primary/30 rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
          <div className="space-y-3 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Package size={13} />
              <span>Importación Directa desde EE.UU. 🇺🇸</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              ¿Buscas un repuesto o componente específico desde USA?
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Importamos repuestos originales OEM y alternativos certificados directamente desde EE.UU. para Jeep, Toyota, Honda, Nissan, Dodge, Chrysler y Lexus. Envíanos tu número de parte OEM o Serial VIN por WhatsApp.
            </p>
          </div>
            <button
              onClick={() => setIsUsaModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-xs uppercase tracking-wider py-4 px-8 rounded-2xl shrink-0 shadow-2xl flex items-center gap-2 relative z-10 border border-blue-400/40 cursor-pointer"
            >
              <Plane size={18} className="animate-bounce" />
              <span>Formulario de Solicitud EE.UU. 🇺🇸</span>
            </button>
          </div>
        </main>

        {/* ========================================================================= */}
        {/* MODAL DE SOLICITUD DE IMPORTACIÓN DIRECTA DE MERCANCÍA DESDE EE.UU. */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {isUsaModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-[#12141a] border border-blue-500/50 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative my-8 max-h-[92vh] flex flex-col"
              >
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-blue-950/90 via-slate-900 to-blue-900/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-blue-400 shadow-md shrink-0">
                      <Plane size={20} className="animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                        <span>Solicitud de Importación EE.UU.</span>
                        <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/40 px-2 py-0.5 rounded-full font-bold">OEM Directo</span>
                      </h2>
                      <p className="text-zinc-400 text-xs mt-0.5">
                        Ingresa el N° de parte o datos del repuesto para cotización express desde EE.UU.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsUsaModalOpen(false)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    title="Cerrar modal"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleUsaSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                  {usaFormSubmitted ? (
                    <div className="text-center py-8 space-y-4">
                      <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 flex items-center justify-center mx-auto text-2xl">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-white">¡Solicitud Generada Exitosamente!</h3>
                      <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                        Se ha abierto tu chat de WhatsApp con el resumen de la solicitud. Un especialista de MasterTech revisará la disponibilidad del número de parte OEM en EE.UU. y te enviará la cotización exacta en USD.
                      </p>
                      <button
                        type="button"
                        onClick={() => { setUsaFormSubmitted(false); setIsUsaModalOpen(false); }}
                        className="btn-primary !py-2.5 !px-6 text-xs border-none mx-auto"
                      >
                        Volver al Catálogo
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Part Number & Product Name */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="usa-part-number" className="block text-xs font-bold text-blue-300 mb-1 flex items-center gap-1">
                            <Tag size={12} />
                            <span>Número de Parte OEM / Código (Recomendado)</span>
                          </label>
                          <input
                            id="usa-part-number"
                            name="usa-part-number"
                            type="text"
                            value={usaForm.partNumber}
                            onChange={(e) => setUsaForm({ ...usaForm, partNumber: e.target.value })}
                            placeholder="Ej. #52008899AD / Mopar / Denso"
                            className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-400 transition-colors font-mono"
                          />
                        </div>

                        <div>
                          <label htmlFor="usa-product-name" className="block text-xs font-bold text-zinc-200 mb-1 flex items-center gap-1">
                            <Package size={12} className="text-primary" />
                            <span>Nombre o Descripción del Repuesto *</span>
                          </label>
                          <input
                            id="usa-product-name"
                            name="usa-product-name"
                            type="text"
                            required
                            value={usaForm.productName}
                            onChange={(e) => setUsaForm({ ...usaForm, productName: e.target.value })}
                            placeholder="Ej. Bomba de agua, Juego de inyectores, Sensor O2"
                            className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-primary transition-colors"
                          />
                        </div>
                      </div>

                      {/* Vehicle Details: Brand, Model, Year, Engine */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                        <div>
                          <label htmlFor="usa-brand" className="block text-[11px] font-bold text-zinc-400 mb-1">Marca *</label>
                          <input
                            id="usa-brand"
                            name="usa-brand"
                            type="text"
                            required
                            value={usaForm.brand}
                            onChange={(e) => setUsaForm({ ...usaForm, brand: e.target.value })}
                            placeholder="Jeep / Toyota"
                            className="w-full bg-black/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-primary"
                          />
                        </div>

                        <div>
                          <label htmlFor="usa-model" className="block text-[11px] font-bold text-zinc-400 mb-1">Modelo *</label>
                          <input
                            id="usa-model"
                            name="usa-model"
                            type="text"
                            required
                            value={usaForm.model}
                            onChange={(e) => setUsaForm({ ...usaForm, model: e.target.value })}
                            placeholder="Grand Cherokee"
                            className="w-full bg-black/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-primary"
                          />
                        </div>

                        <div>
                          <label htmlFor="usa-year" className="block text-[11px] font-bold text-zinc-400 mb-1">Año *</label>
                          <input
                            id="usa-year"
                            name="usa-year"
                            type="text"
                            required
                            value={usaForm.year}
                            onChange={(e) => setUsaForm({ ...usaForm, year: e.target.value })}
                            placeholder="2018"
                            className="w-full bg-black/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-primary"
                          />
                        </div>

                        <div>
                          <label htmlFor="usa-engine" className="block text-[11px] font-bold text-zinc-400 mb-1">Motor</label>
                          <input
                            id="usa-engine"
                            name="usa-engine"
                            type="text"
                            value={usaForm.engine}
                            onChange={(e) => setUsaForm({ ...usaForm, engine: e.target.value })}
                            placeholder="3.6L V6"
                            className="w-full bg-black/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      {/* Serial VIN & Shipping Method */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="usa-vin" className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1">
                            <ShieldCheck size={12} className="text-green-400" />
                            <span>Número de Chasis / Serial VIN (17 dígitos)</span>
                          </label>
                          <input
                            id="usa-vin"
                            name="usa-vin"
                            type="text"
                            value={usaForm.vin}
                            onChange={(e) => setUsaForm({ ...usaForm, vin: e.target.value.toUpperCase() })}
                            placeholder="Ej. 1C4RJFAG8JC123456 (Opcional)"
                            className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-primary transition-colors font-mono uppercase"
                          />
                        </div>

                        <div>
                          <label htmlFor="usa-shipping" className="block text-xs font-bold text-blue-300 mb-1 flex items-center gap-1">
                            <Plane size={12} />
                            <span>Modalidad de Logística Preferida</span>
                          </label>
                          <select
                            id="usa-shipping"
                            name="usa-shipping"
                            value={usaForm.shippingMode}
                            onChange={(e) => setUsaForm({ ...usaForm, shippingMode: e.target.value })}
                            className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-blue-400 transition-colors font-medium"
                          >
                            <option value="Express Aéreo (3 a 5 días hábiles)">✈️ Express Aéreo (3 a 5 días hábiles - Urgente)</option>
                            <option value="Marítimo Estándar (15 a 21 días hábiles)">🚢 Marítimo Estándar (15 a 21 días hábiles - Económico)</option>
                          </select>
                        </div>
                      </div>

                      {/* Client Name & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="usa-client-name" className="block text-xs font-bold text-zinc-200 mb-1">Nombre y Apellido *</label>
                          <input
                            id="usa-client-name"
                            name="usa-client-name"
                            type="text"
                            required
                            value={usaForm.clientName}
                            onChange={(e) => setUsaForm({ ...usaForm, clientName: e.target.value })}
                            placeholder="Tu nombre completo"
                            className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-primary transition-colors"
                          />
                        </div>

                        <div>
                          <label htmlFor="usa-phone" className="block text-xs font-bold text-zinc-200 mb-1">Teléfono WhatsApp *</label>
                          <input
                            id="usa-phone"
                            name="usa-phone"
                            type="tel"
                            required
                            value={usaForm.phone}
                            onChange={(e) => setUsaForm({ ...usaForm, phone: e.target.value })}
                            placeholder="+58 412 1234567"
                            className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-primary transition-colors"
                          />
                        </div>
                      </div>

                      {/* Additional Notes */}
                      <div>
                        <label htmlFor="usa-notes" className="block text-xs font-bold text-zinc-300 mb-1">Notas Adicionales o Detalles del Repuesto</label>
                        <textarea
                          id="usa-notes"
                          name="usa-notes"
                          rows={2}
                          value={usaForm.notes}
                          onChange={(e) => setUsaForm({ ...usaForm, notes: e.target.value })}
                          placeholder="Especifica lado (derecho/izquierdo), si requieres kit completo o consultas extra..."
                          className="w-full bg-black/60 border border-white/15 rounded-xl p-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-primary transition-colors resize-none"
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmittingUsa}
                          className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black uppercase text-xs tracking-wider py-3.5 px-6 rounded-2xl transition-all shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2 cursor-pointer border border-blue-400/40"
                        >
                          <Plane size={16} className="animate-bounce" />
                          <span>{isSubmittingUsa ? 'Procesando...' : 'Enviar Solicitud e Iniciar Cotización por WhatsApp'}</span>
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Product Detail Modal */}
        <AnimatePresence>
          {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#12141a] border border-white/20 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-primary" />
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{selectedProduct.category}</span>
                </div>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-white/10">
                    <img src={selectedProduct.img} alt={selectedProduct.title} className="w-full h-full object-cover" />
                    {selectedProduct.badge && (
                      <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg">
                        {selectedProduct.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedProduct.partNumber && (
                        <span className="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full inline-block">
                          N° OEM: {selectedProduct.partNumber}
                        </span>
                      )}

                      <span className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${
                        (selectedProduct.stock ?? 10) > 0 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {(selectedProduct.stock ?? 10) > 0 ? `🟢 ${selectedProduct.stock ?? 10} en Stock` : '🔴 Agotado / Importación USA 🇺🇸'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white leading-snug">{selectedProduct.title}</h3>
                    <div className="text-2xl font-black text-primary">{selectedProduct.price}</div>
                    <p className="text-zinc-300 text-xs leading-relaxed">{selectedProduct.desc}</p>
                  </div>
                </div>

                {selectedProduct.isImportedUSA && (
                  <div className="p-4 bg-blue-950/40 border border-blue-500/30 rounded-2xl text-xs text-blue-200 flex items-center gap-3">
                    <span className="text-2xl">🇺🇸</span>
                    <div>
                      <strong className="text-white block font-bold">Repuesto Importado Directamente desde EE.UU.</strong>
                      <p className="text-blue-300/80 text-[11px] mt-0.5">Producto con especificaciones originales OEM importado desde EE.UU. Garantía de durabilidad y ajuste perfecto en taller.</p>
                    </div>
                  </div>
                )}

                {selectedProduct.longDesc && (
                  <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">Ficha Técnica & Detalles de Calidad</h4>
                    <p className="text-zinc-300 text-xs leading-relaxed">{selectedProduct.longDesc}</p>
                  </div>
                )}

                {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">Especificaciones Técnicas:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProduct.specs.map((spec, i) => (
                        <li key={i} className="text-xs text-zinc-300 flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-primary shrink-0" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedProduct.compatibility && (
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-xs text-zinc-300 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-primary shrink-0" />
                    <span><strong>Compatibilidad de Vehículos:</strong> {selectedProduct.compatibility}</span>
                  </div>
                )}
              </div>

              {/* Modal Footer CTA */}
              <div className="p-4 sm:p-6 border-t border-white/10 bg-black/40 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <span className="text-xs text-zinc-400">¿Deseas solicitar o cotizar este repuesto?</span>
                <a
                  href={getWhatsAppMessage(selectedProduct.title, selectedProduct.price, selectedProduct.partNumber, selectedProduct.isImportedUSA, selectedProduct.stock)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba5a] text-black text-xs font-black uppercase tracking-wider py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <WhatsAppIcon size={18} />
                  <span>{(selectedProduct.stock ?? 10) === 0 ? 'Cotizar Importación USA 🇺🇸' : 'Consultar Disponibilidad'}</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

        {/* Floating Cart Button */}
        <AnimatePresence>
          {cartTotalItems > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              onClick={() => setIsCartOpen(true)}
              className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#202D36] via-primary to-[#5C7896] text-white font-black text-xs uppercase tracking-wider py-3.5 px-5 rounded-full shadow-2xl shadow-primary/40 border border-[#7598B9]/30 flex items-center gap-3 hover:scale-105 transition-all cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart size={20} />
                <span className="absolute -top-2.5 -right-2.5 bg-white text-black font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-lg border border-primary">
                  {cartTotalItems}
                </span>
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] opacity-80">Mi Carrito</span>
                <span className="text-sm font-black">${cartTotalAmount.toFixed(2)} USD</span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* MODAL / SLIDE-OVER DE MI CARRITO DE REPUESTOS */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {isCartOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-[#1c262e] border border-primary/40 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative my-6 max-h-[92vh] flex flex-col"
              >
                {/* Header */}
                <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-[#202D36] via-[#1c262e] to-[#141b21] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-md shrink-0">
                      <ShoppingCart size={20} />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                        <span>Mi Carrito de Repuestos</span>
                        <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-bold">
                          {cartTotalItems} {cartTotalItems === 1 ? 'pieza' : 'piezas'}
                        </span>
                      </h2>
                      <p className="text-zinc-400 text-xs mt-0.5">
                        Selecciona cantidades y envía el pedido completo a nuestros asesores por WhatsApp.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    title="Cerrar carrito"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Cart Body */}
                <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
                  {cartSuccess ? (
                    <div className="text-center py-8 space-y-4">
                      <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 flex items-center justify-center mx-auto text-2xl">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-white">¡Pedido Enviado a WhatsApp!</h3>
                      <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                        Se ha generado el desglose de tu pedido multielemento. El equipo de MasterTech revisará el stock y te confirmará disponibilidad inmediata.
                      </p>
                      <div className="flex gap-3 justify-center pt-2">
                        <button
                          type="button"
                          onClick={() => { clearCart(); setCartSuccess(false); setIsCartOpen(false); }}
                          className="btn-primary !py-2.5 !px-6 text-xs border-none"
                        >
                          Vaciar Carrito y Continuar
                        </button>
                      </div>
                    </div>
                  ) : cart.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <ShoppingBag size={48} className="mx-auto text-zinc-600 mb-2" />
                      <h3 className="text-lg font-bold text-white">Tu carrito está vacío</h3>
                      <p className="text-zinc-400 text-xs max-w-xs mx-auto">Navega por nuestro catálogo y presiona "+ Agregar al Carrito" en las piezas que necesites.</p>
                      <button
                        type="button"
                        onClick={() => setIsCartOpen(false)}
                        className="btn-primary !py-2 !px-5 text-xs border-none mt-2"
                      >
                        Explorar Catálogo
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSendCartOrder} className="space-y-4">
                      {/* Itemized List */}
                      <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
                        {cart.map((item) => {
                          const itemPriceNum = parsePrice(item.product.price);
                          const itemSubtotal = (itemPriceNum * item.quantity).toFixed(2);
                          return (
                            <div key={item.product.id} className="flex items-center justify-between gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl">
                              <img src={item.product.img} alt={item.product.title} className="w-14 h-14 object-cover rounded-xl border border-white/10 bg-black shrink-0" />
                              
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-white truncate">{item.product.title}</h4>
                                {item.product.partNumber && (
                                  <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">#{item.product.partNumber}</span>
                                )}
                                <span className="text-xs font-black text-primary block mt-0.5">{item.product.price} <span className="text-[10px] text-zinc-400 font-normal">/ c/u</span></span>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-1.5 bg-black/60 border border-white/15 rounded-xl p-1">
                                <button
                                  type="button"
                                  onClick={() => updateCartQty(item.product.id, -1)}
                                  className="w-6 h-6 rounded-lg bg-white/10 hover:bg-primary text-white flex items-center justify-center font-bold text-xs cursor-pointer transition-colors"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="font-bold text-xs text-white px-2 min-w-[1.5rem] text-center">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateCartQty(item.product.id, 1)}
                                  className="w-6 h-6 rounded-lg bg-white/10 hover:bg-primary text-white flex items-center justify-center font-bold text-xs cursor-pointer transition-colors"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              {/* Subtotal & Trash */}
                              <div className="text-right shrink-0 min-w-[70px]">
                                <span className="text-xs font-black text-white block">${itemSubtotal}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.product.id)}
                                  className="text-zinc-500 hover:text-red-400 text-[10px] mt-1 flex items-center gap-0.5 justify-end ml-auto cursor-pointer"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Order Calculation Summary Box */}
                      <div className="bg-gradient-to-r from-[#202D36]/80 via-[#1c262e] to-[#202D36]/80 border border-primary/40 p-4 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center text-xs text-zinc-400">
                          <span>Cantidad Total de Repuestos:</span>
                          <span className="font-bold text-white">{cartTotalItems} unidades</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/10 text-sm font-black">
                          <span className="text-white uppercase tracking-wider">Monto Total Estimado:</span>
                          <span className="text-xl text-primary font-display">${cartTotalAmount.toFixed(2)} USD</span>
                        </div>
                      </div>

                      {/* Customer Inputs */}
                      <div className="space-y-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <User size={13} className="text-primary" />
                          <span>Datos del Solicitante (Para Enviar Presupuesto)</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <input
                            type="text"
                            required
                            placeholder="Tu Nombre *"
                            value={cartClient.name}
                            onChange={(e) => setCartClient({ ...cartClient, name: e.target.value })}
                            className="w-full bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-primary"
                          />
                          <input
                            type="tel"
                            required
                            placeholder="Teléfono / WhatsApp *"
                            value={cartClient.phone}
                            onChange={(e) => setCartClient({ ...cartClient, phone: e.target.value })}
                            className="w-full bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-primary"
                          />
                          <input
                            type="text"
                            placeholder="Vehículo (Ej. Jeep 2018)"
                            value={cartClient.vehicle}
                            onChange={(e) => setCartClient({ ...cartClient, vehicle: e.target.value })}
                            className="w-full bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={clearCart}
                          className="px-3 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-bold border border-white/10 transition-colors cursor-pointer"
                        >
                          Vaciar
                        </button>

                        <button
                          type="submit"
                          disabled={isSubmittingCart}
                          className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] text-black font-black uppercase text-xs tracking-wider py-3.5 px-6 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <WhatsAppIcon size={18} />
                          <span>{isSubmittingCart ? 'Procesando...' : `Enviar Pedido (${cartTotalItems} piezas - $${cartTotalAmount.toFixed(2)})`}</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      {/* Footer */}
      <footer className="bg-[#08090b] border-t border-white/10 py-12 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          <img src={config.LOGO_URL || "/logo.png"} alt="MasterTech" className="h-8 mx-auto opacity-70" />
          <p>© {new Date().getFullYear()} Taller MasterTech. Todos los derechos reservados. Repuestos y Tecnología Automotriz.</p>
        </div>
      </footer>
    </div>
  );
}
