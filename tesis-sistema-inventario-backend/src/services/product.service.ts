import * as data_source_1 from "../config/data-source";
import * as product_entity_1 from "../entities/product.entity";
import * as error_middleware_1 from "../middlewares/error.middleware";
const repo = () => data_source_1.AppDataSource.getRepository(product_entity_1.Product);
/**
 * Activa una sola vez la extensión `unaccent` de PostgreSQL para que la búsqueda
 * ignore tildes. Si la base no permite crearla, la búsqueda sigue funcionando
 * sin distinguir mayúsculas, aunque sí distinga tildes.
 */
let searchIndexReady: Promise<boolean> | null = null;
const hasSearchIndex = () => {
    if (!searchIndexReady) {
        searchIndexReady = data_source_1.AppDataSource.query("SELECT to_regprocedure('public.inventory_search_normalize(text)') IS NOT NULL AS available")
            .then((rows) => rows[0].available === true)
            .catch(() => false);
    }
    return searchIndexReady;
};
/**
 * Service layer for Product CRUD operations and optimized search.
 * Designed to reduce manual registration time from 10 hours weekly.
 */
export const ProductService = {
    async summary(includePurchasePrice: boolean) {
        const price = includePurchasePrice ? 'COALESCE(NULLIF(purchase_price, 0), sale_price)' : 'sale_price';
        const [totals] = await data_source_1.AppDataSource.query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE is_active AND stock <= min_stock)::int AS "lowStockCount", COALESCE(SUM(stock * ${price}), 0)::float8 AS value FROM products`);
        const categories = await data_source_1.AppDataSource.query(`SELECT COALESCE(c.name, 'General') AS name, COUNT(*)::int AS total FROM products p LEFT JOIN subcategories s ON p.subcategory_id = s.id LEFT JOIN categories c ON s.category_id = c.id GROUP BY c.name`);
        const lowStock = await data_source_1.AppDataSource.query(`SELECT id, name, brand, model, stock, min_stock AS "minStock", sale_price::float8 AS "salePrice" FROM products WHERE is_active AND stock <= min_stock ORDER BY stock, name LIMIT 50`);
        return { ...totals, categories, lowStock };
    },
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
        // Sin distinguir mayúsculas (ILIKE) y, si está disponible, sin distinguir tildes (unaccent)
        if (search) {
            const indexed = await hasSearchIndex();
            const words = search.trim().split(/\s+/).filter(Boolean).slice(0, 8);
            words.forEach((word, index) => {
                const param = `word${index}`;
                const normalized = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                const escaped = (indexed ? normalized : word).replace(/[\\%_]/g, "\\$&");
                const condition = ["product.name", "product.brand", "product.model", "product.serial_number"]
                    .map((col) => indexed ? `public.inventory_search_normalize(${col}) LIKE :${param}` : `${col} ILIKE :${param}`)
                    .join(" OR ");
                qb.andWhere(`(${condition})`, { [param]: `%${escaped}%` });
            });
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
        try {
            await repo().remove(product);
        } catch (error) {
            if (error && ['23503', '23001'].includes(error.driverError?.code || error.code))
                throw new error_middleware_1.AppError(409, 'El producto tiene movimientos y no se puede eliminar. Puede desactivarlo.');
            throw error;
        }
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
