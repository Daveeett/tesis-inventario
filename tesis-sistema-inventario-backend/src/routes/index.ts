import * as express_1 from "express";
import * as category_routes_1 from "./category.routes";
import * as subcategory_routes_1 from "./subcategory.routes";
import * as product_routes_1 from "./product.routes";
import * as inventory_routes_1 from "./inventory.routes";
export const router = express_1.Router();
import { authRoutes } from "./auth.routes";

exports.router.use("/auth", authRoutes);
exports.router.use("/categories", category_routes_1.categoryRoutes);
exports.router.use("/subcategories", subcategory_routes_1.subcategoryRoutes);
exports.router.use("/products", product_routes_1.productRoutes);
exports.router.use("/inventory", inventory_routes_1.inventoryRoutes);
