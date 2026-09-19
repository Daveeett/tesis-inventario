import * as data_source_1 from "../config/data-source";
import * as category_entity_1 from "../entities/category.entity";
import * as error_middleware_1 from "../middlewares/error.middleware";
const repo = () => data_source_1.AppDataSource.getRepository(category_entity_1.Category);
/**
 * Service layer for Category CRUD operations.
 */
export const CategoryService = {
    /** Obtener todas las categorías con sus subcategorías */
    async findAll() {
        return repo().find({
            relations: ["subcategories"],
            order: { name: "ASC" },
        });
    },
    /** Obtener una categoría por ID */
    async findById(id) {
        const category = await repo().findOne({
            where: { id },
            relations: ["subcategories"],
        });
        if (!category)
            throw new error_middleware_1.AppError(404, "Categoría no encontrada");
        return category;
    },
    /** Crear una nueva categoría */
    async create(data) {
        const exists = await repo().findOne({ where: { name: data.name } });
        if (exists)
            throw new error_middleware_1.AppError(409, "Ya existe una categoría con ese nombre");
        const category = repo().create(data);
        return repo().save(category);
    },
    /** Actualizar una categoría existente */
    async update(id, data) {
        const category = await exports.CategoryService.findById(id);
        if (data.name && data.name !== category.name) {
            const exists = await repo().findOne({ where: { name: data.name } });
            if (exists)
                throw new error_middleware_1.AppError(409, "Ya existe una categoría con ese nombre");
        }
        Object.assign(category, data);
        return repo().save(category);
    },
    /** Eliminar una categoría por ID */
    async delete(id) {
        const category = await exports.CategoryService.findById(id);
        await repo().remove(category);
    },
};
