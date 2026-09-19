import * as express_1 from "express";
import * as category_controller_1 from "../controllers/category.controller";
import * as validate_middleware_1 from "../middlewares/validate.middleware";
import * as category_dto_1 from "../dtos/category.dto";
export const categoryRoutes = express_1.Router();
/**
 * @openapi
 * tags:
 *   name: Categories
 *   description: Gestión de Categorías
 */

/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorías devuelta con éxito
 */
exports.categoryRoutes.get("/", category_controller_1.CategoryController.getAll);

/**
 * @openapi
 * /api/categories/{id}:
 *   get:
 *     summary: Obtener una categoría por su ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría encontrada
 */
exports.categoryRoutes.get("/:id", category_controller_1.CategoryController.getById);

/**
 * @openapi
 * /api/categories:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoría creada
 */
exports.categoryRoutes.post("/", validate_middleware_1.validate(category_dto_1.createCategorySchema), category_controller_1.CategoryController.create);

/**
 * @openapi
 * /api/categories/{id}:
 *   put:
 *     summary: Actualizar una categoría
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada
 */
exports.categoryRoutes.put("/:id", validate_middleware_1.validate(category_dto_1.updateCategorySchema), category_controller_1.CategoryController.update);

/**
 * @openapi
 * /api/categories/{id}:
 *   delete:
 *     summary: Eliminar una categoría
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría eliminada
 */
exports.categoryRoutes.delete("/:id", category_controller_1.CategoryController.delete);
