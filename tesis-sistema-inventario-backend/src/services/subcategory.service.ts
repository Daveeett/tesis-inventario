import * as data_source_1 from "../config/data-source";
import * as subcategory_entity_1 from "../entities/subcategory.entity";
import * as error_middleware_1 from "../middlewares/error.middleware";
import * as category_service_1 from "./category.service";
const repo = () => data_source_1.AppDataSource.getRepository(subcategory_entity_1.Subcategory);
/**
 * Service layer for Subcategory CRUD operations.
 */
export const SubcategoryService = {
    /** Obtener todas las subcategorías */
    async findAll() {
        return repo().find({
            relations: ["category"],
            order: { name: "ASC" },
        });
    },
    /** Obtener subcategorías por ID de categoría */
    async findByCategoryId(categoryId) {
        return repo().find({
            where: { categoryId },
            relations: ["category"],
            order: { name: "ASC" },
        });
    },
    /** Obtener una subcategoría por ID */
    async findById(id) {
        const subcategory = await repo().findOne({
            where: { id },
            relations: ["category"],
        });
        if (!subcategory)
            throw new error_middleware_1.AppError(404, "Subcategoría no encontrada");
        return subcategory;
    },
    /** Crear una nueva subcategoría */
    async create(data) {
        // Verificar que la categoría padre existe
        await category_service_1.CategoryService.findById(data.categoryId);
        const subcategory = repo().create(data);
        return repo().save(subcategory);
    },
    /** Actualizar una subcategoría existente */
    async update(id, data) {
        const subcategory = await exports.SubcategoryService.findById(id);
        if (data.categoryId) {
            await category_service_1.CategoryService.findById(data.categoryId);
        }
        Object.assign(subcategory, data);
        return repo().save(subcategory);
    },
    /** Eliminar una subcategoría por ID */
    async delete(id) {
        const subcategory = await exports.SubcategoryService.findById(id);
        await repo().remove(subcategory);
    },
};
