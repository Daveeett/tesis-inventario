import "reflect-metadata";
import * as typeorm_1 from "typeorm";
import * as environment_1 from "./environment";
import * as category_entity_1 from "../entities/category.entity";
import * as subcategory_entity_1 from "../entities/subcategory.entity";
import * as product_entity_1 from "../entities/product.entity";
import * as inventory_movement_entity_1 from "../entities/inventory-movement.entity";
import * as user_entity_1 from "../entities/user.entity";

export const AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: environment_1.env.DB_HOST,
    port: environment_1.env.DB_PORT,
    username: environment_1.env.DB_USER,
    password: environment_1.env.DB_PASSWORD,
    database: environment_1.env.DB_DATABASE,
    ssl: environment_1.env.DB_SSL ? { rejectUnauthorized: false } : false,
    synchronize: true, // Auto-sync schema in development/initial deploy
    logging: environment_1.env.NODE_ENV === "development",
    entities: [category_entity_1.Category, subcategory_entity_1.Subcategory, product_entity_1.Product, inventory_movement_entity_1.InventoryMovement, user_entity_1.User],
});
