import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Search, Tag, Filter, CheckCircle2, ShieldCheck, ArrowRight, ExternalLink, Wrench, X } from 'lucide-react';
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
}

const DEFAULT_CATALOG: CatalogItem[] = [
  {
    id: 1,
    title: "Kit Cambio de Aceite Sintético 5W-30 + Filtro OEM",
    category: "Aceites y Fluidos",
    price: "$45.00",
    desc: "Aceite sintético de alto rendimiento con aditivos antidesgaste de última generación. Incluye filtro de aceite original e instalación.",
    longDesc: "Servicio completo de lubricación que protege tu motor contra la fricción a altas temperaturas. Incluye revisión de 15 puntos de control de fluidos y reemplazo de filtro con especificación original.",
    img: "/24214142.png",
    badge: "Más Vendido",
    specs: ["Protección contra lodos y depósitos", "Durabilidad hasta 8,000 km", "Incluye mano de obra especializada"],
    compatibility: "Jeep, Toyota, Honda, Nissan, Dodge, Lexus, Hyundai, Kia"
  },
  {
    id: 2,
    title: "Pastillas de Freno Cerámicas Premium (Eje Delantero o Trasero)",
    category: "Frenos y Suspensión",
    price: "$55.00",
    desc: "Pastillas cerámicas de baja emisión de polvo, frenado silencioso y máximo agarre térmico para SUVs y sedanes.",
    longDesc: "Diseñadas para brindar una respuesta de frenado inmediata sin ruidos molestos. Reducen el desgaste de los discos y mantienen los rines limpios de residuo metálico.",
    img: "/assets/servicio-frenos.jpg",
    badge: "Garantía MasterTech",
    specs: ["Compuesto 100% cerámico", "Frenado libre de chirridos", "Resistencia térmica hasta 650°C"],
    compatibility: "Compatibles con vehículos Japoneses y Americanos"
  },
  {
    id: 3,
    title: "Diagnóstico Computarizado Escáner Multimarca Avanzado",
    category: "Diagnóstico y Electrónica",
    price: "$30.00",
    desc: "Escaneo profundo de módulos de motor, transmisión, ABS y Airbag con reporte técnico digital e interpretación experta.",
    longDesc: "Conexión a la red CAN-Bus del vehículo para identificar códigos de falla activos y pendientes (DTC), lecturas de sensores en tiempo real y prueba de actuadores.",
    img: "/assets/servicio-electricidad.jpg",
    badge: "Servicio Exprés",
    specs: ["Reporte digital enviado a tu WhatsApp", "Análisis de parámetros en vivo", "Asesoría para corrección de fallas"],
    compatibility: "Todos los modelos OBD2 (1996 en adelante)"
  },
  {
    id: 4,
    title: "Limpieza Ultrasónica e Inspección de Inyectores de Gasolina",
    category: "Mantenimiento y Filtros",
    price: "$40.00",
    desc: "Limpieza en tinas ultrasónicas, prueba en banco de flujo, sustitución de microfiltros y o-rings de sellado.",
    longDesc: "Restaura el patrón de pulverización óptimo de los inyectores, eliminando titubeos al acelerar y reduciendo el consumo excesivo de combustible.",
    img: "/assets/servicio-inyeccion.jpg",
    badge: "Ahorro de Combustible",
    specs: ["Prueba de estanqueidad y abanico", "Reemplazo de microfiltros y sellos", "Optimización de mezcla aire/combustible"],
    compatibility: "Motores multipunto (MPI) y GDI"
  },
  {
    id: 5,
    title: "Recarga Completa de Gas A/A R134a + Detección UV de Fugas",
    category: "Climatización A/A",
    price: "$35.00",
    desc: "Vacío del sistema, carga de refrigerante sintético R134a con tinte UV trazador de fugas y aceite de compresor.",
    longDesc: "Recupera la capacidad de enfriamiento máximo de tu aire acondicionado. Incluye inspección del presostato y limpieza del condensador.",
    img: "/assets/servicio-climatizacion.jpg",
    badge: "Frío Garantizado",
    specs: ["Vacío de presión negativa 30 min", "Carga precisa según gramaje de fábrica", "Aceite sintético PAG incluido"],
    compatibility: "Sistemas R134a y R1234yf"
  },
  {
    id: 6,
    title: "Mantenimiento Preventivo de Suspensión y Amortiguadores",
    category: "Frenos y Suspensión",
    price: "$70.00",
    desc: "Inspección técnica de muñones, bujes, cazoletas y amortiguadores con ajuste de torque especificado por fabricante.",
    longDesc: "Corrige ruidos molestos en el tren delantero, vibraciones en marcha y desgaste irregular de cauchos para brindar un manejo firme y confortable.",
    img: "/assets/servicio-mecanica.jpg",
    badge: "Seguridad Total",
    specs: ["Revisión de bujes y muñones", "Verificación de fugas en amortiguadores", "Informe fotográfico de piezas"],
    compatibility: "4x4, SUVs, Pick-ups y Sedanes"
  },
  {
    id: 7,
    title: "Batería Automotriz Libre de Mantenimiento 600A / 700A",
    category: "Diagnóstico y Electrónica",
    price: "$85.00",
    desc: "Batería sellada libre de mantenimiento, prueba de alternador de regalo e instalación inmediata en taller.",
    longDesc: "Potencia de arranque superior para clima cálido y exigencia eléctrica. Incluye diagnóstico completo del sistema de carga antes de la entrega.",
    img: "/assets/instalaciones.jpg",
    badge: "Instalación Gratis",
    specs: ["12 Meses de garantía por escrito", "Prueba de carga y arranque en frío", "Instalación sin perder memoria de radio/ECU"],
    compatibility: "Amplio catálogo para todas las marcas"
  },
  {
    id: 8,
    title: "Servicio Detallado de Motor y Carrocería con Cera Protectora",
    category: "Cuidado y Estética",
    price: "$25.00",
    desc: "Lavado detallado de carrocería, limpieza profunda de motor sin afectar componentes sensibles y aplicación de cera.",
    longDesc: "Entrega tu vehículo renovado con productos biodegradables que no dañan mangueras ni conexiones eléctricas del compartimento motor.",
    img: "/assets/instalaciones.jpg",
    badge: "Estética Premium",
    specs: ["Champú neutro brillante", "Protector sintético de mangueras", "Aspirado completo de interior"],
    compatibility: "Todos los vehículos"
  }
];

const CATEGORIES = [
  "Todos",
  "Aceites y Fluidos",
  "Frenos y Suspensión",
  "Mantenimiento y Filtros",
  "Diagnóstico y Electrónica",
  "Climatización A/A",
  "Cuidado y Estética"
];

export default function Catalogo() {
  const [config, setConfig] = useState<any>(CONFIG_DEFAULT);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(DEFAULT_CATALOG);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<CatalogItem | null>(null);

  useEffect(() => {
    // SEO setup
    document.title = "Catálogo de Productos y Servicios - Taller MasterTech";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Explora el catálogo de repuestos, lubricantes y servicios especializados para tu vehículo en Taller MasterTech Porlamar.');
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
          setConfig((prev: any) => ({ ...prev, ...data }));
          try {
            if (data.CATALOG_PRODUCTS_JSON) {
              setCatalogItems(JSON.parse(data.CATALOG_PRODUCTS_JSON));
            }
          } catch (e) {}
        }
      } catch (err) {}
    };

    fetchSettings();
  }, []);

  const filteredItems = useMemo(() => {
    return catalogItems.filter(item => {
      const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory;
      const matchesSearch = searchQuery.trim() === "" || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [catalogItems, selectedCategory, searchQuery]);

  const getWhatsAppMessage = (productName: string, price: string) => {
    const text = `Hola *Taller MasterTech* 🛠️, desearía solicitar información y cotización sobre el siguiente producto/servicio de su catálogo:\n\n📌 *${productName}*\n💵 *Precio estimado:* ${price}\n\n¿Tienen disponibilidad y turno para realizar la atención?`;
    const cleanLink = config.WHATSAPP_LINK || "https://wa.link/xnj37f";
    if (cleanLink.includes('wa.me') || cleanLink.includes('wa.link')) {
      return `${cleanLink}?text=${encodeURIComponent(text)}`;
    }
    return `https://wa.me/${(config.PHONE_NUMBER || '+584123565012').replace(/\+/g, '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Top Navbar */}
      <nav className="fixed w-full z-50 bg-[#0d0e12]/95 backdrop-blur-xl py-3 border-b border-white/10 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2 group">
            <ChevronLeft size={20} className="text-zinc-400 group-hover:text-primary transition-colors" />
            <img src={config.LOGO_URL || "/logo.png"} alt="MasterTech" className="h-8 sm:h-9 w-auto" />
          </a>

          <div className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-bold text-zinc-400">
            <a href="/" className="hover:text-white transition-colors">Inicio</a>
            <a href="/nosotros" className="hover:text-white transition-colors">Nosotros</a>
            <a href="/servicios" className="hover:text-white transition-colors">Servicios</a>
            <a href="/catalogo" className="text-primary font-black uppercase tracking-wider border-b-2 border-primary pb-0.5">Catálogo</a>
            <a href="/faq" className="hover:text-white transition-colors">Preguntas Frecuentes</a>
          </div>

          <a 
            href={config.WHATSAPP_LINK || "https://wa.link/xnj37f"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !py-2 !px-4 sm:!px-5 text-xs border-none flex items-center gap-2"
          >
            <WhatsAppIcon size={16} />
            <span className="hidden sm:inline">WhatsApp Directo</span>
            <span className="sm:hidden">Cotizar</span>
          </a>
        </div>
      </nav>

      {/* Main Container */}
      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4"
          >
            <Tag size={14} />
            <span>Catálogo Oficial Taller MasterTech</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-4"
          >
            Repuestos, Fluidos y <span className="text-primary">Servicios Especializados</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-sm sm:text-base leading-relaxed"
          >
            Explora nuestra selección de componentes de alta durabilidad, lubricantes sintéticos y paquetes de mantenimiento preventivo con garantía certificada para tu vehículo.
          </motion.p>
        </div>

        {/* Search & Category Filter Control Bar */}
        <div className="space-y-6 mb-12">
          {/* Search Box */}
          <div className="max-w-xl mx-auto relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text"
              placeholder="Buscar por producto, servicio o palabra clave (ej. Freno, Aceite, Diagnóstico)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-10 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-primary transition-all backdrop-blur-md"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-x-1/2 text-zinc-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive 
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
            <Wrench size={40} className="mx-auto text-zinc-500 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No encontramos coincidencias</h3>
            <p className="text-zinc-400 text-xs px-6 mb-6">Prueba seleccionando otra categoría o borrando tu término de búsqueda.</p>
            <button 
              onClick={() => { setSelectedCategory("Todos"); setSearchQuery(""); }}
              className="btn-primary !py-2 !px-5 text-xs border-none"
            >
              Ver Todo el Catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-[#12141a]/90 border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-primary/50 transition-all flex flex-col group shadow-xl relative"
              >
                {/* Product Image Box */}
                <div className="relative aspect-[4/3] bg-black overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(item)}>
                  <img 
                    src={item.img} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12141a] via-transparent to-black/30" />

                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-bold px-2.5 py-1 rounded-full text-zinc-300">
                    {item.category}
                  </span>

                  {/* Badge if present */}
                  {item.badge && (
                    <span className="absolute top-3 right-3 bg-primary text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg">
                      {item.badge}
                    </span>
                  )}

                  {/* Price Tag */}
                  <div className="absolute bottom-3 right-3 bg-black/90 backdrop-blur-md border border-primary/40 text-primary font-black text-sm px-3 py-1 rounded-full shadow-lg">
                    {item.price}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 
                      onClick={() => setSelectedProduct(item)}
                      className="text-base font-bold text-white group-hover:text-primary transition-colors cursor-pointer line-clamp-2"
                    >
                      {item.title}
                    </h3>
                    <p className="text-zinc-400 text-xs line-clamp-3 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-2 space-y-2 border-t border-white/5">
                    <a
                      href={getWhatsAppMessage(item.title, item.price)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/40 text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      <WhatsAppIcon size={16} />
                      <span>Cotizar por WhatsApp</span>
                    </a>

                    <button
                      onClick={() => setSelectedProduct(item)}
                      className="w-full text-zinc-400 hover:text-white text-[11px] font-bold py-1.5 text-center flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Ver detalles y ficha</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Custom Quote Help Section */}
        <div className="mt-20 bg-gradient-to-r from-red-950/40 via-[#12141a] to-zinc-950/60 border border-primary/30 rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
          <div className="space-y-3 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Wrench size={13} />
              <span>Atención Personalizada de Repuestos</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              ¿No encuentras el repuesto específico para tu vehículo?
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Nuestro equipo de compras ubica componentes originales o alternativos de alta calidad para Jeep, Toyota, Honda, Nissan, Dodge y más marcas. Envíanos tu Serial VIN o modelo.
            </p>
          </div>

          <a 
            href={config.WHATSAPP_LINK || "https://wa.link/xnj37f"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !py-3.5 !px-8 text-xs font-black uppercase tracking-wider shrink-0 flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
          >
            <WhatsAppIcon size={18} />
            <span>Consultar con Asesor</span>
          </a>
        </div>
      </main>

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
                    <h3 className="text-xl font-bold text-white leading-snug">{selectedProduct.title}</h3>
                    <div className="text-2xl font-black text-primary">{selectedProduct.price}</div>
                    <p className="text-zinc-300 text-xs leading-relaxed">{selectedProduct.desc}</p>
                  </div>
                </div>

                {selectedProduct.longDesc && (
                  <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">Detalles Técnicos & Servicio</h4>
                    <p className="text-zinc-300 text-xs leading-relaxed">{selectedProduct.longDesc}</p>
                  </div>
                )}

                {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">Características Clave:</h4>
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
                    <span><strong>Compatibilidad:</strong> {selectedProduct.compatibility}</span>
                  </div>
                )}
              </div>

              {/* Modal Footer CTA */}
              <div className="p-4 sm:p-6 border-t border-white/10 bg-black/40 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <span className="text-xs text-zinc-400">¿Deseas este producto o agendar su instalación?</span>
                <a
                  href={getWhatsAppMessage(selectedProduct.title, selectedProduct.price)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba5a] text-black text-xs font-black uppercase tracking-wider py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <WhatsAppIcon size={18} />
                  <span>Cotizar Vía WhatsApp</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-[#08090b] border-t border-white/10 py-12 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          <img src={config.LOGO_URL || "/logo.png"} alt="MasterTech" className="h-8 mx-auto opacity-70" />
          <p>© {new Date().getFullYear()} Taller MasterTech. Todos los derechos reservados. Tecnología y Precisión Automotriz.</p>
        </div>
      </footer>
    </div>
  );
}
