import { Request, Response, NextFunction } from "express";
import { InventoryService } from "../services/inventory.service";

/**
 * Controller for Inventory Movement endpoints.
 * Includes quick registration for bulk merchandise entry and exit.
 */
export const InventoryController = {
  /** Obtener historial de movimientos */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.query.productId as string | undefined;
      const movements = await InventoryService.findAll(productId);
      res.json({ success: true, data: movements });
    } catch (error) {
      next(error);
    }
  },

  /** Registrar un movimiento individual */
  async createMovement(req: Request, res: Response, next: NextFunction) {
    try {
      const movement = await InventoryService.createMovement(req.body);
      res.status(201).json({ success: true, data: movement });
    } catch (error) {
      next(error);
    }
  },

  /** Registro rápido de mercadería (entrada masiva) */
  async quickRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const movements = await InventoryService.quickRegister(req.body);
      res.status(201).json({
        success: true,
        data: movements,
        message: `${movements.length} productos registrados exitosamente`,
      });
    } catch (error) {
      next(error);
    }
  },

  /** Registro de salida de mercadería (carrito de despachos/ventas) */
  async quickExit(req: Request, res: Response, next: NextFunction) {
    try {
      const movements = await InventoryService.quickExit(req.body);
      res.status(201).json({
        success: true,
        data: movements,
        message: `${movements.length} producto(s) debitados correctamente del inventario`,
      });
    } catch (error) {
      next(error);
    }
  },
};
