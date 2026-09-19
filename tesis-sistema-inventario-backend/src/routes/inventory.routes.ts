import { Router } from "express";
import { InventoryController } from "../controllers/inventory.controller";
import { validate } from "../middlewares/validate.middleware";
import { createMovementSchema, quickRegisterSchema } from "../dtos/inventory.dto";

export const inventoryRoutes = Router();

/**
 * @openapi
 * tags:
 *   name: Inventory
 *   description: Gestión de Movimientos de Inventario
 */

/**
 * @openapi
 * /api/inventory/movements:
 *   get:
 *     summary: Obtener todos los movimientos
 *     tags: [Inventory]
 */
inventoryRoutes.get("/movements", InventoryController.getAll);

/**
 * @openapi
 * /api/inventory/movements:
 *   post:
 *     summary: Registrar un nuevo movimiento de inventario (IN/OUT)
 *     tags: [Inventory]
 */
inventoryRoutes.post("/movements", validate(createMovementSchema), InventoryController.createMovement);

/**
 * @openapi
 * /api/inventory/quick-register:
 *   post:
 *     summary: Registro rapido y movimiento inicial
 *     tags: [Inventory]
 */
inventoryRoutes.post("/quick-register", validate(quickRegisterSchema), InventoryController.quickRegister);

/**
 * @openapi
 * /api/inventory/quick-exit:
 *   post:
 *     summary: Registro de salida de mercadería y débito de inventario
 *     tags: [Inventory]
 */
inventoryRoutes.post("/quick-exit", InventoryController.quickExit);
