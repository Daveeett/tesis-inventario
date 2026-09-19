import * as zod_1 from "zod";
/** Schema para crear un producto */
export const createProductSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "El nombre es obligatorio" })
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(200, "El nombre no puede exceder 200 caracteres")
        .trim(),
    brand: zod_1.z
        .string({ required_error: "La marca es obligatoria" })
        .min(1, "La marca es obligatoria")
        .max(100)
        .trim(),
    model: zod_1.z.string().max(100).nullable().optional(),
    serialNumber: zod_1.z.string().max(100).nullable().optional(),
    description: zod_1.z.string().max(1000).nullable().optional(),
    specifications: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).nullable().optional(),
    purchasePrice: zod_1.z
        .number({ required_error: "El precio de compra es obligatorio" })
        .min(0, "El precio de compra debe ser mayor o igual a 0"),
    salePrice: zod_1.z
        .number({ required_error: "El precio de venta es obligatorio" })
        .min(0, "El precio de venta debe ser mayor o igual a 0"),
    stock: zod_1.z.number().int().min(0).default(0),
    minStock: zod_1.z.number().int().min(0).default(1),
    subcategoryId: zod_1.z.string().uuid("ID de subcategoría inválido").nullable().optional(),
    imageBase64: zod_1.z.string().nullable().optional(),
});
/** Schema para actualizar un producto */
export const updateProductSchema = exports.createProductSchema.partial().extend({
    isActive: zod_1.z.boolean().optional(),
});
/** Schema para query de búsqueda de productos con paginación */
export const productQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    search: zod_1.z.string().optional(),
    brand: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().uuid().optional(),
    subcategoryId: zod_1.z.string().uuid().optional(),
    isActive: zod_1.z.coerce.boolean().optional(),
    sortBy: zod_1.z.enum(["name", "brand", "salePrice", "stock", "createdAt"]).default("createdAt"),
    sortOrder: zod_1.z.enum(["ASC", "DESC"]).default("DESC"),
});
