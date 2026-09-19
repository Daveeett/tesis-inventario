import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";
import { BarcodeService } from "../services/barcode.service";

/** Helper para sanitizar el precio de compra si el rol es VENDEDOR */
function sanitizeProductRole(product: any, role?: string) {
  if (!product) return product;
  if (role === "VENDEDOR") {
    if (Array.isArray(product)) {
      return product.map((p) => {
        const { purchasePrice, ...rest } = p;
        return rest;
      });
    }
    const { purchasePrice, ...rest } = product;
    return rest;
  }
  return product;
}

/**
 * Controller for Product endpoints.
 * Includes search with pagination, barcode lookup and brand filter.
 */
export const ProductController = {
    /** Búsqueda paginada con filtros */
    async search(req: Request, res: Response, next: NextFunction) {
        try {
            const query = (req as any).parsedQuery;
            const result = await ProductService.search(query);
            if (req.auth?.role === "VENDEDOR" && result?.data) {
                result.data = sanitizeProductRole(result.data, "VENDEDOR");
            }
            res.json({ success: true, ...result });
        }
        catch (error) {
            next(error);
        }
    },
    /** Obtener todos los productos (sin paginar) */
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            let products = await ProductService.findAll();
            products = sanitizeProductRole(products, req.auth?.role);
            res.json({ success: true, data: products });
        }
        catch (error) {
            next(error);
        }
    },
    /** Obtener un producto por ID */
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            let product = await ProductService.findById(req.params.id);
            product = sanitizeProductRole(product, req.auth?.role);
            res.json({ success: true, data: product });
        }
        catch (error) {
            next(error);
        }
    },
    /** Consultar información por código de barras */
    async lookupBarcode(req: Request, res: Response, next: NextFunction) {
        try {
            const barcode = Array.isArray(req.params.barcode) ? req.params.barcode[0] : (req.params.barcode as string);
            const info = await BarcodeService.lookup(barcode || "");
            res.json({ success: true, data: info });
        }
        catch (error) {
            next(error);
        }
    },
    /** Crear un producto */
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await ProductService.create(req.body);
            res.status(201).json({ success: true, data: product });
        }
        catch (error) {
            next(error);
        }
    },
    /** Actualizar un producto */
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await ProductService.update(req.params.id, req.body);
            res.json({ success: true, data: product });
        }
        catch (error) {
            next(error);
        }
    },
    /** Eliminar un producto */
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await ProductService.delete(req.params.id);
            res.json({ success: true, message: "Producto eliminado correctamente" });
        }
        catch (error) {
            next(error);
        }
    },
    /** Obtener marcas disponibles */
    async getBrands(_req: Request, res: Response, next: NextFunction) {
        try {
            const brands = await ProductService.getDistinctBrands();
            res.json({ success: true, data: brands });
        }
        catch (error) {
            next(error);
        }
    },
};
