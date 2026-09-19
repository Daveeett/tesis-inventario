import * as express_1 from "express";
import * as subcategory_controller_1 from "../controllers/subcategory.controller";
import * as validate_middleware_1 from "../middlewares/validate.middleware";
import * as subcategory_dto_1 from "../dtos/subcategory.dto";
export const subcategoryRoutes = express_1.Router();
/**
 * @openapi
 * tags:
 *   name: Subcategories
 *   description: Gestión de Subcategorías
 */

/**
 * @openapi
 * /api/subcategories:
 *   get:
 *     summary: Obtener todas las subcategorías
 *     tags: [Subcategories]
 *     responses:
 *       200:
 *         description: Lista devuelta con éxito
 */
exports.subcategoryRoutes.get("/", subcategory_controller_1.SubcategoryController.getAll);

/**
 * @openapi
 * /api/subcategories/by-category/{categoryId}:
 *   get:
 *     summary: Obtener subcategorías mediante categoryId
 *     tags: [Subcategories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de subcategorías devuelta con éxito
 */
exports.subcategoryRoutes.get("/by-category/:categoryId", subcategory_controller_1.SubcategoryController.getByCategoryId);

/**
 * @openapi
 * /api/subcategories/{id}:
 *   get:
 *     summary: Obtener una subcategoría específica
 *     tags: [Subcategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subcategoría devuelta
 */
exports.subcategoryRoutes.get("/:id", subcategory_controller_1.SubcategoryController.getById);

/**
 * @openapi
 * /api/subcategories:
 *   post:
 *     summary: Crear subcategoría
 *     tags: [Subcategories]
 *     responses:
 *       201:
 *         description: Creado
 */
exports.subcategoryRoutes.post("/", validate_middleware_1.validate(subcategory_dto_1.createSubcategorySchema), subcategory_controller_1.SubcategoryController.create);

/**
 * @openapi
 * /api/subcategories/{id}:
 *   put:
 *     summary: Actualizar
 *     tags: [Subcategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Actualizado
 */
exports.subcategoryRoutes.put("/:id", validate_middleware_1.validate(subcategory_dto_1.updateSubcategorySchema), subcategory_controller_1.SubcategoryController.update);

/**
 * @openapi
 * /api/subcategories/{id}:
 *   delete:
 *     summary: Eliminar subcategoria
 *     tags: [Subcategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Eliminado
 */
exports.subcategoryRoutes.delete("/:id", subcategory_controller_1.SubcategoryController.delete);
