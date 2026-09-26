import "reflect-metadata";
import { AppDataSource } from "../config/data-source";
import { Category } from "../entities/category.entity";
import { Subcategory } from "../entities/subcategory.entity";
import { Product } from "../entities/product.entity";

/**
 * Script de Carga de Productos e Inventario para Producción / Vercel
 * 
 * Uso:
 *   npx ts-node src/scripts/seed-products.ts
 *   o mediante el comando:
 *   npm run seed:prod
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

const INITIAL_PRODUCTS: InitialProduct[] = [
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

async function seedProducts() {
  console.log("-------------------------------------------------------");
  console.log("🌱 Iniciando Script de Carga de Productos para Producción...");
  console.log("-------------------------------------------------------");

  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✅ Conexión establecida con la base de datos PostgreSQL.");
    }

    const categoryRepo = AppDataSource.getRepository(Category);
    const subcategoryRepo = AppDataSource.getRepository(Subcategory);
    const productRepo = AppDataSource.getRepository(Product);

    // 1. Crear / Asegurar Categorías y Subcategorías
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
        console.log(`➕ Categoría creada: "${category.name}"`);
      } else {
        console.log(`ℹ️ Categoría existente: "${category.name}"`);
      }

      for (const subName of catData.subcategories) {
        let subcategory = await subcategoryRepo.findOne({
          where: { name: subName, categoryId: category.id },
        });

        if (!subcategory) {
          subcategory = subcategoryRepo.create({
            name: subName,
            description: `Subcategoría ${subName} en ${catData.name}`,
            categoryId: category.id,
            isActive: true,
          });
          await subcategoryRepo.save(subcategory);
          console.log(`  └─ ➕ Subcategoría creada: "${subcategory.name}"`);
        } else {
          console.log(`  └─ ℹ️ Subcategoría existente: "${subcategory.name}"`);
        }

        subcategoryMap.set(`${catData.name}::${subName}`, subcategory);
      }
    }

    // 2. Insertar / Actualizar Productos
    console.log("\n📦 Procesando productos...");
    let addedCount = 0;
    let updatedCount = 0;

    for (const prodData of INITIAL_PRODUCTS) {
      const subKey = `${prodData.categoryName}::${prodData.subcategoryName}`;
      const subcategory = subcategoryMap.get(subKey);

      if (!subcategory) {
        console.error(`❌ No se encontró la subcategoría para ${prodData.name}`);
        continue;
      }

      // Buscar si el producto existe por número de serie o nombre
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

        await productRepo.save(newProduct);
        console.log(`✅ Producto insertado: ${newProduct.name} | Stock: ${newProduct.stock} | Precio: $${newProduct.salePrice}`);
        addedCount++;
      } else {
        // Actualizar datos de producto existente
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
        console.log(`🔄 Producto actualizado: ${existingProduct.name} | Stock: ${existingProduct.stock}`);
        updatedCount++;
      }
    }

    console.log("\n-------------------------------------------------------");
    console.log(`✨ Proceso finalizado exitosamente.`);
    console.log(`   Nuevos productos agregados: ${addedCount}`);
    console.log(`   Productos actualizados:     ${updatedCount}`);
    console.log("-------------------------------------------------------");
  } catch (error) {
    console.error("❌ Error durante la ejecución del script de productos:", error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("🔌 Conexión a la base de datos cerrada.");
    }
  }
}

// Ejecutar script
seedProducts();
