import * as data_source_1 from "../config/data-source";
import * as product_entity_1 from "../entities/product.entity";
import * as error_middleware_1 from "../middlewares/error.middleware";
const repo = () => data_source_1.AppDataSource.getRepository(product_entity_1.Product);
/**
 * Service layer for Product CRUD operations and optimized search.
 * Designed to reduce manual registration time from 10 hours weekly.
 */
export const ProductService = {
    /**
     * Búsqueda optimizada de productos con paginación y filtros.
     * Soporta búsqueda por nombre, marca, categoría y subcategoría.
     */
    async search(query) {
        const { page, limit, search, brand, categoryId, subcategoryId, isActive, sortBy, sortOrder } = query;
        const qb = repo()
            .createQueryBuilder("product")
            .leftJoinAndSelect("product.subcategory", "subcategory")
            .leftJoinAndSelect("subcategory.category", "category");
        // Filtro de búsqueda general (nombre, marca, modelo, serial)
        if (search) {
            qb.andWhere("(product.name LIKE :search OR product.brand LIKE :search OR product.model LIKE :search OR product.serial_number LIKE :search)", { search: `%${search}%` });
        }
        // Filtro por marca
        if (brand) {
            qb.andWhere("product.brand = :brand", { brand });
        }
        // Filtro por categoría (a través de subcategoría)
        if (categoryId) {
            qb.andWhere("subcategory.category_id = :categoryId", { categoryId });
        }
        // Filtro por subcategoría directa
        if (subcategoryId) {
            qb.andWhere("product.subcategory_id = :subcategoryId", { subcategoryId });
        }
        // Filtro por estado activo/inactivo
        if (isActive !== undefined) {
            qb.andWhere("product.is_active = :isActive", { isActive });
        }
        // Ordenamiento dinámico (usar nombre de propiedad TypeScript, no columna SQL)
        const sortColumn = sortBy === "createdAt" ? "product.createdAt" : `product.${sortBy}`;
        qb.orderBy(sortColumn, sortOrder);
        // Paginación
        const skip = (page - 1) * limit;
        qb.skip(skip).take(limit);
        const [data, total] = await qb.getManyAndCount();
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    },
    /** Obtener un producto por ID con sus relaciones */
    async findById(id) {
        const product = await repo().findOne({
            where: { id },
            relations: ["subcategory", "subcategory.category"],
        });
        if (!product)
            throw new error_middleware_1.AppError(404, "Producto no encontrado");
        return product;
    },
    /** Obtener todos los productos (sin paginar, para selects) */
    async findAll() {
        return repo().find({
            relations: ["subcategory", "subcategory.category"],
            order: { name: "ASC" },
        });
    },
    /** Crear un nuevo producto */
    async create(data) {
        // Validar número de serie único si se proporciona
        if (data.serialNumber) {
            const exists = await repo().findOne({ where: { serialNumber: data.serialNumber } });
            if (exists)
                throw new error_middleware_1.AppError(409, "Ya existe un producto con ese número de serie");
        }
        const product = repo().create(data);
        return repo().save(product);
    },
    /** Actualizar un producto existente */
    async update(id, data) {
        const product = await exports.ProductService.findById(id);
        // Validar número de serie único si cambia
        if (data.serialNumber && data.serialNumber !== product.serialNumber) {
            const exists = await repo().findOne({ where: { serialNumber: data.serialNumber } });
            if (exists)
                throw new error_middleware_1.AppError(409, "Ya existe un producto con ese número de serie");
        }
        Object.assign(product, data);
        return repo().save(product);
    },
    /** Eliminar un producto por ID */
    async delete(id) {
        const product = await exports.ProductService.findById(id);
        await repo().remove(product);
    },
    /** Obtener las marcas distintas disponibles (para filtro) */
    async getDistinctBrands() {
        const result = await repo()
            .createQueryBuilder("product")
            .select("DISTINCT product.brand", "brand")
            .where("product.brand IS NOT NULL")
            .orderBy("product.brand", "ASC")
            .getRawMany();
        return result.map((r) => r.brand);
    },
};
