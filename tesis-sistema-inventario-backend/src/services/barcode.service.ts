import https from "https";

export interface BarcodeProductInfo {
  name: string;
  brand: string;
  model?: string;
  serialNumber: string;
  description?: string;
  imageUrl?: string;
  specifications?: Record<string, string>;
  foundInInternet: boolean;
}

export const BarcodeService = {
  /**
   * Consulta la información de un producto por código de barras usando Open Food Facts / Open Product Data API.
   * Si no se encuentra información en internet, devuelve una plantilla limpia pre-llenando únicamente el código de barras.
   */
  async lookup(barcode: string): Promise<BarcodeProductInfo> {
    const cleanCode = barcode.trim();
    if (!cleanCode) {
      return {
        name: "",
        brand: "",
        serialNumber: "",
        foundInInternet: false,
      };
    }

    try {
      const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(cleanCode)}.json`;
      const data = await new Promise<any>((resolve, reject) => {
        const req = https.get(url, { headers: { "User-Agent": "InnovatecnoInventorySystem/1.0" } }, (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => {
            try {
              resolve(JSON.parse(body));
            } catch (e) {
              resolve(null);
            }
          });
        });
        req.on("error", () => resolve(null));
        req.setTimeout(4000, () => {
          req.destroy();
          resolve(null);
        });
      });

      if (data && data.status === 1 && data.product) {
        const prod = data.product;
        const name = prod.product_name || prod.product_name_es || prod.abbreviated_product_name || "";
        const brand = prod.brands || prod.brand_owner || "";
        const description = prod.generic_name || prod.generic_name_es || prod.categories || "";
        const imageUrl = prod.image_front_url || prod.image_url || "";
        
        const specs: Record<string, string> = {};
        if (prod.quantity) specs["Cantidad/Empaque"] = prod.quantity;
        if (prod.origin) specs["Origen"] = prod.origin;
        if (prod.packaging) specs["Presentación"] = prod.packaging;

        return {
          name,
          brand,
          serialNumber: cleanCode,
          description,
          imageUrl,
          specifications: Object.keys(specs).length ? specs : undefined,
          foundInInternet: true,
        };
      }
    } catch (err) {
      console.warn("Barcode lookup error (OpenFoodFacts):", err);
    }

    // --- FALLBACK 1: Intentar con Open Product Facts (tecnología, cosméticos, etc.) ---
    try {
      const urlProduct = `https://world.openproductsfacts.org/api/v2/product/${encodeURIComponent(cleanCode)}.json`;
      const data = await new Promise<any>((resolve) => {
        const req = https.get(urlProduct, { headers: { "User-Agent": "InnovatecnoInventorySystem/1.0" } }, (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => {
            try { resolve(JSON.parse(body)); } catch (e) { resolve(null); }
          });
        });
        req.on("error", () => resolve(null));
        req.setTimeout(4000, () => { req.destroy(); resolve(null); });
      });

      if (data && data.status === 1 && data.product) {
        const prod = data.product;
        const name = prod.product_name || prod.product_name_es || prod.abbreviated_product_name || "";
        const brand = prod.brands || prod.brand_owner || "";
        const description = prod.generic_name || prod.generic_name_es || prod.categories || "";
        const imageUrl = prod.image_front_url || prod.image_url || "";
        
        const specs: Record<string, string> = {};
        if (prod.quantity) specs["Cantidad/Empaque"] = prod.quantity;
        if (prod.origin) specs["Origen"] = prod.origin;
        if (prod.packaging) specs["Presentación"] = prod.packaging;

        return {
          name,
          brand,
          serialNumber: cleanCode,
          description,
          imageUrl,
          specifications: Object.keys(specs).length ? specs : undefined,
          foundInInternet: true,
        };
      }
    } catch (err) {
      console.warn("Barcode lookup error (OpenProductFacts):", err);
    }

    // --- FALLBACK 2: Intentar con UPCitemdb (productos generales, tecnología, etc) ---
    try {
      const upcUrl = `https://api.upcitemdb.com/prod/trial/lookup?upc=${encodeURIComponent(cleanCode)}`;
      const data = await new Promise<any>((resolve) => {
        const req = https.get(upcUrl, { headers: { "User-Agent": "InnovatecnoInventorySystem/1.0", "Accept-Encoding": "gzip,deflate" } }, (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => {
            try { resolve(JSON.parse(body)); } catch (e) { resolve(null); }
          });
        });
        req.on("error", () => resolve(null));
        req.setTimeout(4000, () => { req.destroy(); resolve(null); });
      });

      if (data && data.code === "OK" && data.items && data.items.length > 0) {
        const item = data.items[0];
        
        const specs: Record<string, string> = {};
        if (item.category) specs["Categoría"] = item.category;
        if (item.color) specs["Color"] = item.color;
        if (item.weight) specs["Peso"] = item.weight;

        return {
          name: item.title || "",
          brand: item.brand || "",
          model: item.model || "",
          serialNumber: cleanCode,
          description: item.description || "",
          imageUrl: (item.images && item.images.length > 0) ? item.images[0] : "",
          specifications: Object.keys(specs).length ? specs : undefined,
          foundInInternet: true,
        };
      }
    } catch (err) {
      console.warn("Barcode lookup error (UPCitemdb):", err);
    }

    return {
      name: "",
      brand: "",
      serialNumber: cleanCode,
      foundInInternet: false,
    };
  },
};
