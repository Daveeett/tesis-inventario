import * as zod_1 from "zod";
/** Schema para crear una categoría */
export const createCategorySchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "El nombre es obligatorio" })
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres")
        .trim(),
    description: zod_1.z.string().max(500).nullable().optional(),
});
/** Schema para actualizar una categoría */
export const updateCategorySchema = exports.createCategorySchema.partial().extend({
    isActive: zod_1.z.boolean().optional(),
});
