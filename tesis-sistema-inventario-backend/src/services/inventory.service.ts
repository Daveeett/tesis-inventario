import { AppDataSource } from "../config/data-source";
import { InventoryMovement } from "../entities/inventory-movement.entity";
import { Product } from "../entities/product.entity";
import { MovementType } from "../entities/enums/movement-type.enum";
import { AppError } from "../middlewares/error.middleware";

const movementRepo = () => AppDataSource.getRepository(InventoryMovement);
const productRepo = () => AppDataSource.getRepository(Product);

export interface QuickExitData {
  items: Array<{ productId: string; quantity: number }>;
  reason: string; // Venta, Producto dañado, Consumo interno, etc.
  customerName?: string;
  exitDate?: string;
}

/**
 * Service layer for Inventory Movement operations.
 * Includes quick entry and quick exit (cart-based) stock registration.
 */
export const InventoryService = {
  /** Obtener historial de movimientos con filtros */
  async findAll(productId?: string) {
    const where: any = {};
    if (productId) where.productId = productId;
    return movementRepo().find({
      where,
      relations: ["product"],
      order: { createdAt: "DESC" },
      take: 100,
    });
  },

  /** Registrar un movimiento individual de inventario */
  async createMovement(data: {
    productId: string;
    type: MovementType | string;
    quantity: number;
    reason?: string;
  }) {
    const product = await productRepo().findOne({ where: { id: data.productId } });
    if (!product) throw new AppError(404, "Producto no encontrado");

    const previousStock = product.stock;
    let newStock: number;

    switch (data.type) {
      case MovementType.IN:
        newStock = previousStock + data.quantity;
        break;
      case MovementType.OUT:
        if (previousStock < data.quantity) {
          throw new AppError(
            400,
            `Stock insuficiente para "${product.name}". Stock actual: ${previousStock}, Solicitado: ${data.quantity}`
          );
        }
        newStock = previousStock - data.quantity;
        break;
      case MovementType.ADJUSTMENT:
        newStock = data.quantity;
        break;
      default:
        throw new AppError(400, "Tipo de movimiento inválido");
    }

    // Actualizar stock del producto
    product.stock = newStock;
    await productRepo().save(product);

    // Crear registro de movimiento
    const movement = movementRepo().create({
      ...data,
      previousStock,
      newStock,
    });
    return movementRepo().save(movement);
  },

  /** Registro rápido de entrada de mercadería */
  async quickRegister(data: { items: Array<{ productId: string; quantity: number }>; reason?: string }) {
    const movements = [];
    for (const item of data.items) {
      const movement = await InventoryService.createMovement({
        productId: item.productId,
        type: MovementType.IN,
        quantity: item.quantity,
        reason: data.reason || "Entrada de mercadería",
      });
      movements.push(movement);
    }
    return movements;
  },

  /**
   * Registro de Salida de Inventario (Carrito de Salida / Despacho / Venta).
   * Debita automáticamente la cantidad indicada del stock de cada producto.
   */
  async quickExit(data: QuickExitData) {
    if (!data.items || data.items.length === 0) {
      throw new AppError(400, "El carrito de salida no puede estar vacío");
    }

    const customerInfo = data.customerName?.trim() ? ` | Cliente: ${data.customerName.trim()}` : "";
    const dateInfo = data.exitDate ? ` | Fecha Salida: ${data.exitDate}` : "";
    const fullReason = `${data.reason || "Salida de mercadería"}${customerInfo}${dateInfo}`;

    const movements = [];
    for (const item of data.items) {
      const movement = await InventoryService.createMovement({
        productId: item.productId,
        type: MovementType.OUT,
        quantity: item.quantity,
        reason: fullReason,
      });
      movements.push(movement);
    }
    return movements;
  },
};
