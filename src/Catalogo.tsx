import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './Navbar';
import { ChevronLeft, Search, Tag, Filter, CheckCircle2, ShieldCheck, ArrowRight, ExternalLink, Package, X, Wrench } from 'lucide-react';
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

export default function Catalogo() {
  const [config, setConfig] = useState<any>(CONFIG_DEFAULT);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(DEFAULT_CATALOG);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<CatalogItem | null>(null);

  useEffect(() => {
    document.title = "Catálogo de Repuestos y Productos - Taller MasterTech";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Catálogo de repuestos originales, aceites sintéticos, baterías y componentes para tu vehículo en Taller MasterTech Porlamar.');
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
        (item.partNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [catalogItems, selectedCategory, searchQuery]);

  const getWhatsAppMessage = (productName: string, price: string, partNumber?: string, isImportedUSA?: boolean, stock?: number) => {
    const partInfo = partNumber ? ` (N° Parte OEM: ${partNumber})` : '';
    let text = '';
    if (stock === 0 || isImportedUSA) {
      text = `Hola *Taller MasterTech* 🛠️, me interesa cotizar la *importación directa desde USA 🇺🇸* del siguiente repuesto:\n\n📦 *${productName}*${partInfo}\n💵 *Precio estimado:* ${price}\n\nQuisiera consultar tiempos de importación y costo total puesto en taller.`;
    } else {
      text = `Hola *Taller MasterTech* 🛠️, me interesa comprar el siguiente repuesto disponible en stock:\n\n📦 *${productName}*${partInfo}\n💵 *Precio publicado:* ${price}\n\n¿Puedo pasar a retirarlo o coordinar la instalación en taller?`;
    }
    const cleanLink = config.WHATSAPP_LINK || "https://wa.link/xnj37f";
    if (cleanLink.includes('wa.me') || cleanLink.includes('wa.link')) {
      return `${cleanLink}?text=${encodeURIComponent(text)}`;
    }
    return `https://wa.me/${(config.PHONE_NUMBER || '+584123565012').replace(/\+/g, '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar activePage="catalogo" config={config} />

      {/* Main Container */}
      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
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
          {/* Search Box */}
          <div className="relative max-w-xl mx-auto">
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

                  {/* USA Badge if present */}
                  {item.isImportedUSA && (
                    <span className="absolute top-3 right-3 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-blue-400/30 flex items-center gap-1">
                      <span>🇺🇸 Importado USA</span>
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
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.partNumber && (
                        <span className="text-[10px] font-mono font-bold text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                          N° Parte: {item.partNumber}
                        </span>
                      )}
                      
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        (item.stock ?? 10) > 0 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {(item.stock ?? 10) > 0 ? `🟢 ${item.stock ?? 10} en Stock` : '🔴 Agotado / Bajo Pedido (USA 🇺🇸)'}
                      </span>
                    </div>

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
                      href={getWhatsAppMessage(item.title, item.price, item.partNumber, item.isImportedUSA, item.stock)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group/btn ${
                        (item.stock ?? 10) === 0 || item.isImportedUSA
                          ? 'bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/40'
                          : 'bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/40'
                      }`}
                    >
                      <WhatsAppIcon size={16} />
                      <span>{(item.stock ?? 10) === 0 ? 'Cotizar Importación USA 🇺🇸' : 'Consultar por WhatsApp'}</span>
                    </a>

                    <button
                      onClick={() => setSelectedProduct(item)}
                      className="w-full text-zinc-400 hover:text-white text-[11px] font-bold py-1.5 text-center flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Ver ficha técnica completa</span>
                      <ArrowRight size={12} />
                    </button>
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
          <a
            href={`https://wa.me/${(config.PHONE_NUMBER || '+584123565012').replace(/\+/g, '')}?text=${encodeURIComponent("Hola *Taller MasterTech* 🛠️, me interesa solicitar la importación directa desde USA 🇺🇸 de un repuesto específico para mi vehículo. ¿Cómo puedo enviarles la lista o número OEM?")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !py-4 !px-8 text-sm font-bold border-none shrink-0 shadow-2xl flex items-center gap-2 relative z-10"
          >
            <WhatsAppIcon size={18} />
            <span>Cotizar Importación USA 🇺🇸</span>
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
