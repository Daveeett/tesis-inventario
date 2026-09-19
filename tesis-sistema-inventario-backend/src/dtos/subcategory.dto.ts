import * as zod_1 from "zod";
/** Schema para crear una subcategoría */
export const createSubcategorySchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "El nombre es obligatorio" })
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres")
        .trim(),
    description: zod_1.z.string().max(500).nullable().optional(),
    categoryId: zod_1.z.string({ required_error: "La categoría es obligatoria" }).uuid("ID de categoría inválido"),
});
/** Schema para actualizar una subcategoría */
export const updateSubcategorySchema = exports.createSubcategorySchema.partial().extend({
    isActive: zod_1.z.boolean().optional(),
});
