import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { validate } from "../middlewares/validate.middleware";
import { productQuerySchema, createProductSchema, updateProductSchema } from "../dtos/product.dto";

export const productRoutes = Router();

/**
 * @openapi
 * tags:
 *   name: Products
 *   description: Gestión de Productos del Inventario
 */

/**
 * @openapi
 * /api/products/barcode-lookup/{barcode}:
 *   get:
 *     summary: Consultar datos de producto en internet por código de barras
 *     tags: [Products]
 */
productRoutes.get("/barcode-lookup/:barcode", ProductController.lookupBarcode);

/**
 * @openapi
 * /api/products/search:
 *   get:
 *     summary: Búsqueda paginada con filtros
 *     tags: [Products]
 */
productRoutes.get("/search", validate(productQuerySchema, "query"), ProductController.search);

/**
 * @openapi
 * /api/products/brands:
 *   get:
 *     summary: Obtener listado de marcas únicas
 *     tags: [Products]
 */
productRoutes.get("/brands", ProductController.getBrands);

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 */
productRoutes.get("/", ProductController.getAll);

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Products]
 */
productRoutes.get("/:id", ProductController.getById);

/**
 * @openapi
 * /api/products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Products]
 */
productRoutes.post("/", validate(createProductSchema), ProductController.create);

/**
 * @openapi
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar un producto existente
 *     tags: [Products]
 */
productRoutes.put("/:id", validate(updateProductSchema), ProductController.update);

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Products]
 */
productRoutes.delete("/:id", ProductController.delete);
