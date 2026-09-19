import * as zod_1 from "zod";
import * as movement_type_enum_1 from "../entities/enums/movement-type.enum";
/** Schema para registrar un movimiento de inventario */
export const createMovementSchema = zod_1.z.object({
    productId: zod_1.z.string({ required_error: "El producto es obligatorio" }).uuid("ID de producto inválido"),
    type: zod_1.z.nativeEnum(movement_type_enum_1.MovementType, { required_error: "El tipo de movimiento es obligatorio" }),
    quantity: zod_1.z
        .number({ required_error: "La cantidad es obligatoria" })
        .int("La cantidad debe ser un número entero")
        .min(1, "La cantidad debe ser al menos 1"),
    reason: zod_1.z.string().max(500).nullable().optional(),
});
/** Schema para registro rápido de mercadería (bulk) */
export const quickRegisterSchema = zod_1.z.object({
    items: zod_1.z
        .array(zod_1.z.object({
        productId: zod_1.z.string().uuid("ID de producto inválido"),
        quantity: zod_1.z.number().int().min(1, "La cantidad debe ser al menos 1"),
    }))
        .min(1, "Debe incluir al menos un producto"),
    reason: zod_1.z.string().max(500).default("Entrada de mercadería"),
});
