import "reflect-metadata";
import { AppDataSource } from "../config/data-source";
import { Category } from "../entities/category.entity";
import { Subcategory } from "../entities/subcategory.entity";
import { Product } from "../entities/product.entity";
import { InventoryMovement } from "../entities/inventory-movement.entity";
import { MovementType } from "../entities/enums/movement-type.enum";

/**
 * Script de Carga de Productos e Inventario (30 Productos Tecnológicos)
 * 
 * Uso:
 *   npm run seed:prod
 *   o
 *   npx ts-node src/scripts/seed-products.ts
 */

interface InitialProduct {
  categoryName: string;
  subcategoryName: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  description: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  specifications: Record<string, string>;
}

const CATEGORIES_DATA = [
  {
    name: "Computadoras y Laptops",
    description: "Equipos portátiles, laptops gaming, ultrabooks y de uso profesional.",
    subcategories: ["Laptops Gaming", "Laptops Profesionales"],
  },
  {
    name: "Celulares y Móviles",
    description: "Smartphones de alta gama, gama media, tablets y accesorios móviles.",
    subcategories: ["Smartphones High-End", "Tablets y iPads"],
  },
  {
    name: "Componentes de PC",
    description: "Tarjetas de video, procesadores, memorias, almacenamiento, placas madre y refrigeración.",
    subcategories: [
      "Tarjetas de Video",
      "Procesadores",
      "Memorias RAM",
      "Almacenamiento SSD",
      "Placas Madre",
      "Fuentes de Poder",
      "Refrigeración",
    ],
  },
  {
    name: "Periféricos y Accesorios",
    description: "Monitores, teclados, mouses, audio, micrófonos y equipo de streaming.",
    subcategories: [
      "Monitores",
      "Teclados y Mouses",
      "Audio y Auriculares",
      "Streaming y Creadores",
    ],
  },
  {
    name: "Redes y Conectividad",
    description: "Routers Wi-Fi de alta velocidad, switches y soluciones de red.",
    subcategories: ["Routers y Conectividad"],
  },
];

const INITIAL_PRODUCTS: InitialProduct[] = [
  // --- COMPUTADORAS Y LAPTOPS ---
  {
    categoryName: "Computadoras y Laptops",
    subcategoryName: "Laptops Gaming",
    name: "Laptop Gaming ASUS ROG Strix G16",
    brand: "ASUS",
    model: "G614JV-AS73",
    serialNumber: "ROG-G614-2026-001",
    description: "Laptop gaming de alto rendimiento con pantalla de 16 pulgadas a 165Hz, procesador Intel i7 y tarjeta gráfica NVIDIA RTX 4060.",
    purchasePrice: 1150.00,
    salePrice: 1499.00,
    stock: 5,
    minStock: 2,
    specifications: {
      "Procesador": "Intel Core i7-13650HX",
      "RAM": "16GB DDR5 4800MHz",
      "Almacenamiento": "1TB SSD M.2 NVMe PCIe 4.0",
      "Pantalla": "16\" FHD+ (1920 x 1200) 165Hz",
      "GPU": "NVIDIA GeForce RTX 4060 8GB GDDR6"
    }
  },
  {
    categoryName: "Computadoras y Laptops",
    subcategoryName: "Laptops Profesionales",
    name: "MacBook Pro 14 M3 Pro",
    brand: "Apple",
    model: "MRX33LL/A",
    serialNumber: "APP-MBP14-M3P-002",
    description: "Potencia profesional excepcional con chip Apple M3 Pro, 18GB de memoria unificada y pantalla Liquid Retina XDR de 14.2 pulgadas.",
    purchasePrice: 1750.00,
    salePrice: 2199.00,
    stock: 4,
    minStock: 1,
    specifications: {
      "Procesador": "Apple M3 Pro (11 núcleos CPU, 14 núcleos GPU)",
      "Memoria": "18GB Unificada",
      "Almacenamiento": "512GB SSD ultrarrápido",
      "Pantalla": "14.2\" Liquid Retina XDR (3024 x 1964) 120Hz ProMotion"
    }
  },
  {
    categoryName: "Computadoras y Laptops",
    subcategoryName: "Laptops Gaming",
    name: "Laptop Lenovo Legion Pro 5",
    brand: "Lenovo",
    model: "16IRX9",
    serialNumber: "LEN-LPRO5-009",
    description: "Laptop gaming con chasis de aluminio, pantalla WQXGA 240Hz y refrigeración Legion ColdFront 5.0.",
    purchasePrice: 1300.00,
    salePrice: 1650.00,
    stock: 6,
    minStock: 2,
    specifications: {
      "Procesador": "Intel Core i7-14700HX",
      "RAM": "32GB DDR5 5600MHz",
      "Almacenamiento": "1TB SSD NVMe PCIe 4.0",
      "Pantalla": "16\" WQXGA (2560 x 1600) IPS 240Hz",
      "GPU": "NVIDIA GeForce RTX 4070 8GB"
    }
  },
  {
    categoryName: "Computadoras y Laptops",
    subcategoryName: "Laptops Profesionales",
    name: "Laptop Dell XPS 15 9530 OLED",
    brand: "Dell",
    model: "XPS-9530-OLED",
    serialNumber: "DEL-XPS15-010",
    description: "Portátil ultracompacto para creadores de contenido con panel táctil OLED 3.5K y diseño de fibra de carbono.",
    purchasePrice: 1600.00,
    salePrice: 1999.00,
    stock: 3,
    minStock: 1,
    specifications: {
      "Procesador": "Intel Core i7-13700H",
      "RAM": "32GB DDR5 4800MHz",
      "Almacenamiento": "1TB SSD PCIe NVMe",
      "Pantalla": "15.6\" 3.5K (3456 x 2160) OLED Táctil",
      "GPU": "NVIDIA GeForce RTX 4060 8GB"
    }
  },

  // --- CELULARES Y MÓVILES ---
  {
    categoryName: "Celulares y Móviles",
    subcategoryName: "Smartphones High-End",
    name: "Samsung Galaxy S24 Ultra 512GB",
    brand: "Samsung",
    model: "SM-S928B",
    serialNumber: "SAM-S24U-512-003",
    description: "Smartphone de nivel profesional con marco de titanio, cámara de 200 MP con Inteligencia Artificial Galaxy AI y S Pen integrado.",
    purchasePrice: 1050.00,
    salePrice: 1349.00,
    stock: 8,
    minStock: 2,
    specifications: {
      "Pantalla": "6.8\" Dynamic AMOLED 2X QHD+ 120Hz",
      "Procesador": "Snapdragon 8 Gen 3 for Galaxy",
      "RAM": "12GB DDR5",
      "Cámara": "200 MP (Principal) + 50 MP (Periscopio) + 12 MP (Ultra Wide)"
    }
  },
  {
    categoryName: "Celulares y Móviles",
    subcategoryName: "Smartphones High-End",
    name: "iPhone 15 Pro Max 256GB Titanio Natural",
    brand: "Apple",
    model: "MU773LZ/A",
    serialNumber: "APP-IP15PM-011",
    description: "El buque insignia de Apple con chip A17 Pro, diseño en titanio aeroespacial y botón de acción personalizable.",
    purchasePrice: 1080.00,
    salePrice: 1399.00,
    stock: 7,
    minStock: 2,
    specifications: {
      "Pantalla": "6.7\" Super Retina XDR OLED ProMotion 120Hz",
      "Procesador": "Apple A17 Pro (3nm)",
      "RAM": "8GB",
      "Cámara": "48 MP con zoom óptico 5x"
    }
  },
  {
    categoryName: "Celulares y Móviles",
    subcategoryName: "Smartphones High-End",
    name: "Google Pixel 8 Pro 128GB",
    brand: "Google",
    model: "GC3VE",
    serialNumber: "GGL-PIX8P-012",
    description: "Fotografía computacional de referencia mundial con chip Google Tensor G3 y 7 años de actualizaciones del sistema.",
    purchasePrice: 720.00,
    salePrice: 899.00,
    stock: 5,
    minStock: 2,
    specifications: {
      "Pantalla": "6.7\" Super Actua LTPO OLED 120Hz",
      "Procesador": "Google Tensor G3",
      "RAM": "12GB LPDDR5X",
      "Batería": "5050 mAh con carga inalámbrica"
    }
  },
  {
    categoryName: "Celulares y Móviles",
    subcategoryName: "Smartphones High-End",
    name: "Xiaomi 14 Ultra 512GB",
    brand: "Xiaomi",
    model: "24030PN60G",
    serialNumber: "XIA-MI14U-013",
    description: "Cámara fotográfica profesional en tu mano con sensor de 1 pulgada Leica y apertura variable infinita.",
    purchasePrice: 890.00,
    salePrice: 1149.00,
    stock: 4,
    minStock: 1,
    specifications: {
      "Pantalla": "6.73\" LTPO AMOLED WQHD+ 120Hz",
      "Procesador": "Snapdragon 8 Gen 3",
      "Óptica": "Leica Summilux con sensor 1\"",
      "Carga": "90W HyperCharge + 80W Inalámbrica"
    }
  },
  {
    categoryName: "Celulares y Móviles",
    subcategoryName: "Tablets y iPads",
    name: "iPad Pro 12.9\" M2 Wi-Fi 256GB",
    brand: "Apple",
    model: "MNXR3LZ/A",
    serialNumber: "APP-IPADP-014",
    description: "La tablet definitiva para ilustradores y diseñadores con pantalla Liquid Retina XDR Mini-LED y soporte para Apple Pencil Hover.",
    purchasePrice: 920.00,
    salePrice: 1199.00,
    stock: 6,
    minStock: 2,
    specifications: {
      "Pantalla": "12.9\" Liquid Retina XDR Mini-LED",
      "Procesador": "Chip Apple M2 con Neural Engine",
      "Almacenamiento": "256GB",
      "Conectividad": "Wi-Fi 6E ultrarrápido"
    }
  },

  // --- COMPONENTES DE PC ---
  {
    categoryName: "Componentes de PC",
    subcategoryName: "Tarjetas de Video",
    name: "Tarjeta de Video MSI GeForce RTX 4070 Ti Super 16GB",
    brand: "MSI",
    model: "RTX-4070TIS-16G-V",
    serialNumber: "MSI-4070TIS-007",
    description: "Tarjeta gráfica con 16GB GDDR6X, soporte para Ray Tracing y DLSS 3.5, ideal para juegos en resolución 1440p y 4K a máximas configuraciones.",
    purchasePrice: 730.00,
    salePrice: 899.00,
    stock: 5,
    minStock: 1,
    specifications: {
      "VRAM": "16GB GDDR6X",
      "Bus de Memoria": "256-bit",
      "Refrigeración": "Sistema TRI FROZR 3 con ventiladores TORX 5.0",
      "Salidas": "3x DisplayPort 1.4a, 1x HDMI 2.1a"
    }
  },
  {
    categoryName: "Componentes de PC",
    subcategoryName: "Tarjetas de Video",
    name: "Tarjeta de Video ASUS ROG Strix GeForce RTX 4090 24GB",
    brand: "ASUS",
    model: "ROG-STRIX-RTX4090-O24G",
    serialNumber: "ASU-RTX4090-015",
    description: "La tarjeta gráfica más potente para entusiastas de la inteligencia artificial, renderizado 3D y gaming extremo 4K.",
    purchasePrice: 1850.00,
    salePrice: 2299.00,
    stock: 3,
    minStock: 1,
    specifications: {
      "VRAM": "24GB GDDR6X",
      "CUDA Cores": "16384",
      "Frecuencia Boost": "2640 MHz (OC Mode)",
      "Fuente recomendada": "1000W"
    }
  },
  {
    categoryName: "Componentes de PC",
    subcategoryName: "Procesadores",
    name: "Procesador AMD Ryzen 7 7800X3D",
    brand: "AMD",
    model: "100-100000910WOF",
    serialNumber: "AMD-7800X3D-008",
    description: "El procesador líder indiscutible para gaming con tecnología 3D V-Cache, 8 núcleos, 16 hilos y socket AM5.",
    purchasePrice: 340.00,
    salePrice: 429.00,
    stock: 9,
    minStock: 2,
    specifications: {
      "Núcleos / Hilos": "8 Núcleos / 16 Hilos",
      "Frecuencia": "4.2GHz Base / 5.0GHz Max Boost",
      "Caché": "104MB Caché Total (L2+L3 3D V-Cache)",
      "Socket": "AM5"
    }
  },
  {
    categoryName: "Componentes de PC",
    subcategoryName: "Procesadores",
    name: "Procesador Intel Core i9-14900K",
    brand: "Intel",
    model: "BX8071514900K",
    serialNumber: "INT-14900K-016",
    description: "Máxima potencia para creadores y tareas multinúcleo pesadas con 24 núcleos y hasta 6.0 GHz de frecuencia.",
    purchasePrice: 470.00,
    salePrice: 589.00,
    stock: 7,
    minStock: 2,
    specifications: {
      "Núcleos / Hilos": "24 Núcleos (8 P-Cores + 16 E-Cores) / 32 Hilos",
      "Frecuencia Max": "Hasta 6.0 GHz Thermal Velocity Boost",
      "Socket": "LGA1700",
      "Consumo Base": "125W"
    }
  },
  {
    categoryName: "Componentes de PC",
    subcategoryName: "Memorias RAM",
    name: "Memoria RAM Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz",
    brand: "Corsair",
    model: "CMH32GX5M2B6000C30",
    serialNumber: "COR-DDR5-32G-017",
    description: "Kit de memoria dual-channel con disipador térmico de aluminio, perfiles AMD EXPO e Intel XMP 3.0 e iluminación RGB dinámica.",
    purchasePrice: 105.00,
    salePrice: 145.00,
    stock: 14,
    minStock: 3,
    specifications: {
      "Capacidad": "32GB (2 x 16GB)",
      "Velocidad": "DDR5 6000MHz",
      "Latencia": "CL30 (30-36-36-76)",
      "Voltaje": "1.40V"
    }
  },
  {
    categoryName: "Componentes de PC",
    subcategoryName: "Almacenamiento SSD",
    name: "SSD NVMe M.2 Samsung 990 PRO 2TB PCIe 4.0",
    brand: "Samsung",
    model: "MZ-V9P2T0B/AM",
    serialNumber: "SAM-990P-2TB-018",
    description: "Velocidades de lectura de hasta 7450 MB/s con control térmico inteligente, optimizado para PlayStation 5 y PC de alto nivel.",
    purchasePrice: 135.00,
    salePrice: 189.00,
    stock: 16,
    minStock: 4,
    specifications: {
      "Capacidad": "2TB",
      "Lectura Secuencial": "Hasta 7,450 MB/s",
      "Escritura Secuencial": "Hasta 6,900 MB/s",
      "Factor de Forma": "M.2 2280 NVMe 2.0"
    }
  },
  {
    categoryName: "Componentes de PC",
    subcategoryName: "Placas Madre",
    name: "Placa Madre ASUS ROG Maximus Z790 Dark Hero",
    brand: "ASUS",
    model: "ROG-MAX-Z790-DH",
    serialNumber: "ASU-Z790DH-019",
    description: "Motherboard premium para socket Intel LGA1700 con 20+1 fases de poder, soporte PCIe 5.0 y Wi-Fi 7 integrado.",
    purchasePrice: 510.00,
    salePrice: 679.00,
    stock: 4,
    minStock: 1,
    specifications: {
      "Chipset": "Intel Z790",
      "Formato": "ATX",
      "Fases de Poder": "20+1+2 etapas de potencia (90A)",
      "Conectividad": "Wi-Fi 7 + LAN Intel 2.5Gb"
    }
  },
  {
    categoryName: "Componentes de PC",
    subcategoryName: "Fuentes de Poder",
    name: "Fuente de Poder Corsair RM1000x 1000W 80 Plus Gold",
    brand: "Corsair",
    model: "CP-9020201-NA",
    serialNumber: "COR-RM1000X-020",
    description: "Fuente de alimentación 100% modular con certificación 80 PLUS Gold, condensadores 105°C japoneses y modo Zero RPM.",
    purchasePrice: 145.00,
    salePrice: 199.00,
    stock: 10,
    minStock: 2,
    specifications: {
      "Potencia": "1000 Watts",
      "Certificación": "80 PLUS Gold",
      "Modularidad": "Totalmente Modular",
      "Ventilador": "135mm con rodamiento de levitación magnética"
    }
  },
  {
    categoryName: "Componentes de PC",
    subcategoryName: "Refrigeración",
    name: "Refrigeración Líquida NZXT Kraken Elite 360 RGB",
    brand: "NZXT",
    model: "RL-KR36E-B1",
    serialNumber: "NZX-KRK360-030",
    description: "Sistema todo-en-uno de enfriamiento líquido con radiador de 360mm y pantalla LCD brillante de 2.36\" para mostrar GIFs y temperaturas.",
    purchasePrice: 220.00,
    salePrice: 299.00,
    stock: 6,
    minStock: 2,
    specifications: {
      "Radiador": "360mm de aluminio",
      "Pantalla": "LCD Gran Angular 2.36\" (640x640, 60Hz)",
      "Ventiladores": "3x F120 RGB Core PWM",
      "Bomba": "Asetek 7ma Generación"
    }
  },

  // --- PERIFÉRICOS Y ACCESORIOS ---
  {
    categoryName: "Periféricos y Accesorios",
    subcategoryName: "Monitores",
    name: "Monitor Gaming LG UltraGear 27\" 4K",
    brand: "LG",
    model: "27GP950-B",
    serialNumber: "LG-27GP950-004",
    description: "Monitor IPS Nano 4K UHD con 144Hz de tasa de refresco, soporte HDMI 2.1 para consolas de última generación y compatibilidad G-Sync.",
    purchasePrice: 480.00,
    salePrice: 649.00,
    stock: 8,
    minStock: 2,
    specifications: {
      "Resolución": "3840 x 2160 (4K UHD)",
      "Tasa de Refresco": "144Hz (160Hz OC)",
      "Tiempo de Respuesta": "1ms GtG",
      "Panel": "Nano IPS con VESA DisplayHDR 600"
    }
  },
  {
    categoryName: "Periféricos y Accesorios",
    subcategoryName: "Monitores",
    name: "Monitor Curvo Samsung Odyssey Neo G9 49\" 240Hz",
    brand: "Samsung",
    model: "LS49AG950NNXZA",
    serialNumber: "SAM-NEOG9-021",
    description: "Monitor ultra ancho con curvatura 1000R inmersiva, panel Quantum Mini-LED y resolución Dual QHD equivalente a dos pantallas de 27\".",
    purchasePrice: 1100.00,
    salePrice: 1499.00,
    stock: 3,
    minStock: 1,
    specifications: {
      "Pantalla": "49\" Curvo (1000R) Dual QHD (5120 x 1440)",
      "Tasa de Refresco": "240Hz",
      "Tecnología": "Quantum Mini-LED HDR2000",
      "Tiempo de Respuesta": "1ms GtG"
    }
  },
  {
    categoryName: "Periféricos y Accesorios",
    subcategoryName: "Monitores",
    name: "Monitor ASUS TUF Gaming 27\" 2K 170Hz",
    brand: "ASUS",
    model: "VG27AQ1A",
    serialNumber: "ASU-TUF27-022",
    description: "Monitor IPS para eSports con resolución WQHD, soporte FreeSync Premium, G-Sync compatible y tecnología Extreme Low Motion Blur.",
    purchasePrice: 220.00,
    salePrice: 299.00,
    stock: 12,
    minStock: 3,
    specifications: {
      "Resolución": "2560 x 1440 (WQHD 2K)",
      "Tasa de Refresco": "170Hz OC",
      "Panel": "IPS con HDR10",
      "Tiempo de Respuesta": "1ms MPRT"
    }
  },
  {
    categoryName: "Periféricos y Accesorios",
    subcategoryName: "Teclados y Mouses",
    name: "Teclado Mecánico Inalámbrico Logitech G PRO X Wireless",
    brand: "Logitech",
    model: "G-PRO-X-WL",
    serialNumber: "LOG-GPROX-005",
    description: "Teclado mecánico inalámbrico de grado profesional para eSports con tecnología LIGHTSPEED y switches GX Blue Clicky.",
    purchasePrice: 110.00,
    salePrice: 169.90,
    stock: 12,
    minStock: 3,
    specifications: {
      "Conectividad": "LIGHTSPEED Inalámbrico / Bluetooth / USB-C",
      "Switches": "GX Blue Clicky Intercambiables",
      "Iluminación": "RGB LIGHTSYNC por tecla"
    }
  },
  {
    categoryName: "Periféricos y Accesorios",
    subcategoryName: "Teclados y Mouses",
    name: "Mouse Gamer Razer DeathAdder V3 Pro Inalámbrico",
    brand: "Razer",
    model: "RZ01-04630100",
    serialNumber: "RZR-DAV3P-006",
    description: "Mouse ultraligero de 63g diseñado ergonómicamente con sensor óptico Focus Pro de 30,000 DPI y switches ópticos de 3ra generación.",
    purchasePrice: 95.00,
    salePrice: 145.00,
    stock: 15,
    minStock: 4,
    specifications: {
      "Peso": "63 gramos",
      "Sensor": "Focus Pro 30K Optical Sensor",
      "Batería": "Hasta 90 horas continuas",
      "Conectividad": "Razer HyperSpeed Wireless"
    }
  },
  {
    categoryName: "Periféricos y Accesorios",
    subcategoryName: "Teclados y Mouses",
    name: "Teclado Mecánico Custom Keychron Q1 Pro Wireless",
    brand: "Keychron",
    model: "Q1P-M1",
    serialNumber: "KEY-Q1PRO-023",
    description: "Teclado mecánico premium 75% con cuerpo de aluminio mecanizado CNC, montura de junta (Gasket Mount) y perilla multimedia programable.",
    purchasePrice: 155.00,
    salePrice: 219.00,
    stock: 8,
    minStock: 2,
    specifications: {
      "Formato": "75% con Knob giratorio",
      "Switches": "Keychron K Pro Red (Hot-swappable)",
      "Conexión": "Bluetooth 5.1 / Cable USB-C",
      "Compatibilidad": "Mac / Windows / Linux"
    }
  },
  {
    categoryName: "Periféricos y Accesorios",
    subcategoryName: "Teclados y Mouses",
    name: "Mouse Ergonómico Logitech MX Master 3S",
    brand: "Logitech",
    model: "910-006557",
    serialNumber: "LOG-MXM3S-024",
    description: "El mouse de productividad por excelencia con clics silenciosos, sensor de 8000 DPI para cualquier superficie y rueda electromagnética MagSpeed.",
    purchasePrice: 75.00,
    salePrice: 109.90,
    stock: 18,
    minStock: 5,
    specifications: {
      "Sensor": "Darkfield 8000 DPI",
      "Rueda": "MagSpeed Scroll electromagnético",
      "Batería": "Hasta 70 días con carga completa",
      "Conexión": "Logi Bolt / Bluetooth"
    }
  },
  {
    categoryName: "Periféricos y Accesorios",
    subcategoryName: "Audio y Auriculares",
    name: "Audífonos Gamer HyperX Cloud Alpha Wireless",
    brand: "HyperX",
    model: "4P5D4AA",
    serialNumber: "HYP-ALPHA-025",
    description: "Auriculares inalámbricos con una batería récord de hasta 300 horas continuas de uso con audio espacial DTS Headphone:X.",
    purchasePrice: 125.00,
    salePrice: 179.99,
    stock: 11,
    minStock: 3,
    specifications: {
      "Batería": "Hasta 300 horas por carga",
      "Drivers": "50mm con doble cámara acústica",
      "Audio": "DTS Headphone:X Spatial Audio",
      "Micrófono": "Desmontable con cancelación de ruido"
    }
  },
  {
    categoryName: "Periféricos y Accesorios",
    subcategoryName: "Audio y Auriculares",
    name: "Auriculares Inalámbricos Sony WH-1000XM5",
    brand: "Sony",
    model: "WH1000XM5/B",
    serialNumber: "SNY-XM5-026",
    description: "Cancelación de ruido líder en la industria con dos procesadores, 8 micrófonos y soporte para audio de alta resolución LDAC.",
    purchasePrice: 280.00,
    salePrice: 389.00,
    stock: 9,
    minStock: 2,
    specifications: {
      "Cancelación de Ruido": "Procesador integrado V1 + QN1",
      "Autonomía": "30 horas con ANC encendido",
      "Códecs": "LDAC, AAC, SBC",
      "Peso": "250 gramos"
    }
  },
  {
    categoryName: "Periféricos y Accesorios",
    subcategoryName: "Streaming y Creadores",
    name: "Micrófono Dinámico Shure MV7 USB/XLR",
    brand: "Shure",
    model: "MV7-K",
    serialNumber: "SHU-MV7K-027",
    description: "Micrófono profesional híbrido USB y XLR para streamers, podcasters y músicos con tecnología de aislamiento de voz.",
    purchasePrice: 185.00,
    salePrice: 249.00,
    stock: 7,
    minStock: 2,
    specifications: {
      "Patrón Polar": "Cardioide unidireccional",
      "Conexión": "Doble salida USB-C y XLR",
      "Procesamiento": "DSP con ShurePlus MOTIV App",
      "Construcción": "Metálica robusta profesional"
    }
  },
  {
    categoryName: "Periféricos y Accesorios",
    subcategoryName: "Streaming y Creadores",
    name: "Cámara Web Elgato Facecam Pro 4K60",
    brand: "Elgato",
    model: "10WAC9901",
    serialNumber: "ELG-FCP4K-028",
    description: "La primera cámara web del mundo con captura en verdadera resolución 4K a 60 cuadros por segundo sin compresión.",
    purchasePrice: 230.00,
    salePrice: 319.99,
    stock: 5,
    minStock: 1,
    specifications: {
      "Resolución": "4K 2160p a 60 fps",
      "Sensor": "Sony STARVIS CMOS de 1/1.8\"",
      "Lente": "Elgato Prime Lens f/2.0 21mm",
      "Conectividad": "USB 3.0 Type-C"
    }
  },

  // --- REDES Y CONECTIVIDAD ---
  {
    categoryName: "Redes y Conectividad",
    subcategoryName: "Routers y Conectividad",
    name: "Router Gaming Wi-Fi 6E ASUS ROG Rapture GT-AXE16000",
    brand: "ASUS",
    model: "GT-AXE16000",
    serialNumber: "ASU-RAX16K-029",
    description: "El primer router gaming cuatri-banda Wi-Fi 6E del mundo con puertos duales de 10Gbps y aceleración de juegos en tres niveles.",
    purchasePrice: 460.00,
    salePrice: 599.99,
    stock: 4,
    minStock: 1,
    specifications: {
      "Estándar": "Wi-Fi 6E Cuatri-banda (hasta 16000 Mbps)",
      "Puertos": "2x 10G Ethernet + 1x 2.5G WAN + 4x 1G LAN",
      "Procesador": "Quad-core 2.0 GHz de 64 bits",
      "Cobertura": "Antenas externas omnidireccionales x8"
    }
  }
];

async function seedProducts() {
  console.log("=======================================================");
  console.log("🌱 INICIANDO CARGA MASIVA DE 30 PRODUCTOS TECNOLÓGICOS");
  console.log("=======================================================");

  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✅ Conexión establecida con la base de datos.");
    }

    const categoryRepo = AppDataSource.getRepository(Category);
    const subcategoryRepo = AppDataSource.getRepository(Subcategory);
    const productRepo = AppDataSource.getRepository(Product);
    const movementRepo = AppDataSource.getRepository(InventoryMovement);

    // 1. Asegurar Categorías y Subcategorías
    console.log("\n📁 Verificando y creando Categorías y Subcategorías...");
    const subcategoryMap = new Map<string, Subcategory>();

    for (const catData of CATEGORIES_DATA) {
      let category = await categoryRepo.findOne({ where: { name: catData.name } });

      if (!category) {
        category = categoryRepo.create({
          name: catData.name,
          description: catData.description,
          isActive: true,
        });
        await categoryRepo.save(category);
        console.log(`  ➕ Categoría creada: "${category.name}"`);
      } else {
        console.log(`  ℹ️ Categoría lista: "${category.name}"`);
      }

      for (const subName of catData.subcategories) {
        let subcategory = await subcategoryRepo.findOne({
          where: { name: subName, categoryId: category.id },
        });

        if (!subcategory) {
          subcategory = subcategoryRepo.create({
            name: subName,
            description: `Subcategoría ${subName} para ${catData.name}`,
            categoryId: category.id,
            isActive: true,
          });
          await subcategoryRepo.save(subcategory);
          console.log(`    └─ ➕ Subcategoría creada: "${subcategory.name}"`);
        } else {
          console.log(`    └─ ℹ️ Subcategoría lista: "${subcategory.name}"`);
        }

        subcategoryMap.set(`${catData.name}::${subName}`, subcategory);
      }
    }

    // 2. Insertar / Actualizar los 30 Productos
    console.log(`\n📦 Procesando catálogo (${INITIAL_PRODUCTS.length} productos)...`);
    let addedCount = 0;
    let updatedCount = 0;

    for (let i = 0; i < INITIAL_PRODUCTS.length; i++) {
      const prodData = INITIAL_PRODUCTS[i];
      const indexStr = `[${String(i + 1).padStart(2, "0")}/${INITIAL_PRODUCTS.length}]`;
      const subKey = `${prodData.categoryName}::${prodData.subcategoryName}`;
      const subcategory = subcategoryMap.get(subKey);

      if (!subcategory) {
        console.error(`❌ ${indexStr} No se encontró subcategoría para: ${prodData.name}`);
        continue;
      }

      // Buscar si el producto ya existe por serialNumber o nombre
      let existingProduct = await productRepo.findOne({
        where: [
          { serialNumber: prodData.serialNumber },
          { name: prodData.name }
        ]
      });

      if (!existingProduct) {
        const newProduct = productRepo.create({
          name: prodData.name,
          brand: prodData.brand,
          model: prodData.model,
          serialNumber: prodData.serialNumber,
          description: prodData.description,
          purchasePrice: prodData.purchasePrice,
          salePrice: prodData.salePrice,
          stock: prodData.stock,
          minStock: prodData.minStock,
          specifications: prodData.specifications,
          subcategoryId: subcategory.id,
          isActive: true
        });

        const savedProduct = await productRepo.save(newProduct);

        // Registrar movimiento de inventario inicial
        if (savedProduct.stock > 0) {
          const initialMovement = movementRepo.create({
            productId: savedProduct.id,
            type: MovementType.IN,
            quantity: savedProduct.stock,
            previousStock: 0,
            newStock: savedProduct.stock,
            reason: "Inventario inicial (Carga del sistema)"
          });
          await movementRepo.save(initialMovement);
        }

        console.log(`  ✅ ${indexStr} Insertado: ${savedProduct.name} | Stock: ${savedProduct.stock} | $${savedProduct.salePrice}`);
        addedCount++;
      } else {
        // Actualizar datos del producto existente si ya estaba
        existingProduct.brand = prodData.brand;
        existingProduct.model = prodData.model;
        existingProduct.description = prodData.description;
        existingProduct.purchasePrice = prodData.purchasePrice;
        existingProduct.salePrice = prodData.salePrice;
        existingProduct.stock = prodData.stock;
        existingProduct.minStock = prodData.minStock;
        existingProduct.specifications = prodData.specifications;
        existingProduct.subcategoryId = subcategory.id;

        await productRepo.save(existingProduct);
        console.log(`  🔄 ${indexStr} Actualizado: ${existingProduct.name} | Stock: ${existingProduct.stock}`);
        updatedCount++;
      }
    }

    console.log("\n=======================================================");
    console.log("✨ PROCESO DE CARGA COMPLETADO CON ÉXITO");
    console.log(`   Total evaluados:       ${INITIAL_PRODUCTS.length}`);
    console.log(`   Nuevos añadidos:       ${addedCount}`);
    console.log(`   Existentes actualizados: ${updatedCount}`);
    console.log("=======================================================");
  } catch (error) {
    console.error("❌ Error durante la ejecución del script:", error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("🔌 Conexión a la base de datos cerrada.");
    }
  }
}

// Ejecutar
seedProducts();
