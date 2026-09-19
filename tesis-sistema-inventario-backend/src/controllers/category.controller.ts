import * as category_service_1 from "../services/category.service";
/**
 * Controller for Category endpoints.
 * Handles HTTP request/response and delegates to CategoryService.
 */
export const CategoryController = {
    async getAll(_req, res, next) {
        try {
            const categories = await category_service_1.CategoryService.findAll();
            res.json({ success: true, data: categories });
        }
        catch (error) {
            next(error);
        }
    },
    async getById(req, res, next) {
        try {
            const category = await category_service_1.CategoryService.findById(req.params.id);
            res.json({ success: true, data: category });
        }
        catch (error) {
            next(error);
        }
    },
    async create(req, res, next) {
        try {
            const category = await category_service_1.CategoryService.create(req.body);
            res.status(201).json({ success: true, data: category });
        }
        catch (error) {
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const category = await category_service_1.CategoryService.update(req.params.id, req.body);
            res.json({ success: true, data: category });
        }
        catch (error) {
            next(error);
        }
    },
    async delete(req, res, next) {
        try {
            await category_service_1.CategoryService.delete(req.params.id);
            res.json({ success: true, message: "Categoría eliminada correctamente" });
        }
        catch (error) {
            next(error);
        }
    },
};
