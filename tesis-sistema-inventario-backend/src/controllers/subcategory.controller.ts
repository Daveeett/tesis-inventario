import * as subcategory_service_1 from "../services/subcategory.service";
/**
 * Controller for Subcategory endpoints.
 */
export const SubcategoryController = {
    async getAll(_req, res, next) {
        try {
            const subcategories = await subcategory_service_1.SubcategoryService.findAll();
            res.json({ success: true, data: subcategories });
        }
        catch (error) {
            next(error);
        }
    },
    async getByCategoryId(req, res, next) {
        try {
            const subcategories = await subcategory_service_1.SubcategoryService.findByCategoryId(req.params.categoryId);
            res.json({ success: true, data: subcategories });
        }
        catch (error) {
            next(error);
        }
    },
    async getById(req, res, next) {
        try {
            const subcategory = await subcategory_service_1.SubcategoryService.findById(req.params.id);
            res.json({ success: true, data: subcategory });
        }
        catch (error) {
            next(error);
        }
    },
    async create(req, res, next) {
        try {
            const subcategory = await subcategory_service_1.SubcategoryService.create(req.body);
            res.status(201).json({ success: true, data: subcategory });
        }
        catch (error) {
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const subcategory = await subcategory_service_1.SubcategoryService.update(req.params.id, req.body);
            res.json({ success: true, data: subcategory });
        }
        catch (error) {
            next(error);
        }
    },
    async delete(req, res, next) {
        try {
            await subcategory_service_1.SubcategoryService.delete(req.params.id);
            res.json({ success: true, message: "Subcategoría eliminada correctamente" });
        }
        catch (error) {
            next(error);
        }
    },
};
