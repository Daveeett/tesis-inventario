/**
 * Script alternativo para sembrar/agregar productos vía REST API en Vercel
 * 
 * Uso:
 *   node src/scripts/seed-via-api.js https://tu-backend-vercel.vercel.app david@admin.com david181218
 */

const API_URL = process.argv[2] || "http://localhost:3001";
const ADMIN_EMAIL = process.argv[3] || "david@admin.com";
const ADMIN_PASSWORD = process.argv[4] || "david181218";

const CATEGORIES_DATA = [
  {
    name: "Computadoras y Laptops",
    description: "Equipos portátiles, laptops gaming y de oficina.",
    subcategories: ["Laptops Gaming", "Laptops Profesionales"],
  },
  {
    name: "Celulares y Móviles",
    description: "Smartphones de alta gama, gama media y accesorios móviles.",
    subcategories: ["Smartphones High-End"],
  },
  {
    name: "Componentes de PC",
    description: "Tarjetas de video, procesadores, memorias y fuentes.",
    subcategories: ["Tarjetas de Video", "Procesadores"],
  },
  {
    name: "Periféricos y Accesorios",
    description: "Monitores, teclados, mouses y accesorios gaming.",
    subcategories: ["Monitores", "Teclados y Mouses"],
  },
];

const PRODUCTS_DATA = [
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
    stock: 3,
    minStock: 1,
    specifications: {
      "Procesador": "Apple M3 Pro (11 núcleos CPU, 14 núcleos GPU)",
      "Memoria": "18GB Unificada",
      "Almacenamiento": "512GB SSD ultrarrápido",
      "Pantalla": "14.2\" Liquid Retina XDR (3024 x 1964) 120Hz ProMotion"
    }
  },
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
    stock: 6,
    minStock: 2,
    specifications: {
      "Pantalla": "6.8\" Dynamic AMOLED 2X QHD+ 120Hz",
      "Procesador": "Snapdragon 8 Gen 3 for Galaxy",
      "RAM": "12GB DDR5",
      "Cámara": "200 MP (Principal) + 50 MP (Periscopio) + 12 MP (Ultra Wide)"
    }
  },
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
    categoryName: "Componentes de PC",
    subcategoryName: "Tarjetas de Video",
    name: "Tarjeta de Video MSI NVIDIA GeForce RTX 4070 Ti Super 16GB",
    brand: "MSI",
    model: "RTX-4070TIS-16G-V",
    serialNumber: "MSI-4070TIS-007",
    description: "Tarjeta gráfica con 16GB GDDR6X, soporte para Ray Tracing y DLSS 3.5, ideal para juegos en resolución 1440p y 4K a máximas configuraciones.",
    purchasePrice: 730.00,
    salePrice: 899.00,
    stock: 4,
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
    subcategoryName: "Procesadores",
    name: "Procesador AMD Ryzen 7 7800X3D",
    brand: "AMD",
    model: "100-100000910WOF",
    serialNumber: "AMD-7800X3D-008",
    description: "El procesador líder indiscutible para gaming con tecnología 3D V-Cache, 8 núcleos, 16 hilos y socket AM5.",
    purchasePrice: 340.00,
    salePrice: 429.00,
    stock: 7,
    minStock: 2,
    specifications: {
      "Núcleos / Hilos": "8 Núcleos / 16 Hilos",
      "Frecuencia": "4.2GHz Base / 5.0GHz Max Boost",
      "Caché": "104MB Caché Total (L2+L3 3D V-Cache)",
      "Socket": "AM5"
    }
  }
];

async function main() {
  let baseUrl = API_URL.trim().replace(/\/api\/?$/i, "").replace(/\/$/, "");
  console.log(`🌐 Conectando a la API en: ${baseUrl}`);

  try {
    // 1. Iniciar sesión para obtener Token JWT
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });

    const loginData = await loginRes.json();
    if (!loginRes.ok) {
      console.error("❌ Error al iniciar sesión:", loginData.message || loginData);
      process.exit(1);
    }

    const token = loginData.token;
    console.log("🔑 Autenticación exitosa como Admin.");

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };

    // 2. Crear Categorías y Subcategorías mediante API
    const subcategoryMap = new Map();

    for (const cat of CATEGORIES_DATA) {
      // Obtener o crear Categoría
      const getCatsRes = await fetch(`${baseUrl}/api/categories`, { headers });
      const categories = await getCatsRes.json();
      let category = Array.isArray(categories) ? categories.find(c => c.name === cat.name) : null;

      if (!category) {
        const createCatRes = await fetch(`${baseUrl}/api/categories`, {
          method: "POST",
          headers,
          body: JSON.stringify({ name: cat.name, description: cat.description }),
        });
        category = await createCatRes.json();
        console.log(`➕ Categoría creada vía API: ${cat.name}`);
      }

      for (const subName of cat.subcategories) {
        const getSubsRes = await fetch(`${baseUrl}/api/subcategories`, { headers });
        const subcategories = await getSubsRes.json();
        let subcategory = Array.isArray(subcategories)
          ? subcategories.find(s => s.name === subName && (s.categoryId === category.id || s.category?.id === category.id))
          : null;

        if (!subcategory) {
          const createSubRes = await fetch(`${baseUrl}/api/subcategories`, {
            method: "POST",
            headers,
            body: JSON.stringify({ name: subName, categoryId: category.id }),
          });
          subcategory = await createSubRes.json();
          console.log(`  └─ ➕ Subcategoría creada vía API: ${subName}`);
        }

        subcategoryMap.set(`${cat.name}::${subName}`, subcategory.id);
      }
    }

    // 3. Crear Productos vía API
    console.log("\n📦 Enviando productos vía API...");
    let count = 0;

    for (const prod of PRODUCTS_DATA) {
      const subcategoryId = subcategoryMap.get(`${prod.categoryName}::${prod.subcategoryName}`);

      const body = {
        name: prod.name,
        brand: prod.brand,
        model: prod.model,
        serialNumber: prod.serialNumber,
        description: prod.description,
        purchasePrice: prod.purchasePrice,
        salePrice: prod.salePrice,
        stock: prod.stock,
        minStock: prod.minStock,
        specifications: prod.specifications,
        subcategoryId: subcategoryId || null
      };

      const res = await fetch(`${baseUrl}/api/products`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const resData = await res.json();
      if (res.ok) {
        console.log(`✅ Producto registrado: ${prod.name} | Stock: ${prod.stock}`);
        count++;
      } else {
        console.log(`⚠️ Producto omitido/existente (${prod.name}):`, resData.message || resData);
      }
    }

    console.log(`\n🎉 Finalizado. ${count} productos creados vía API.`);

  } catch (error) {
    console.error("❌ Error de red o servidor:", error.message);
  }
}

main();
