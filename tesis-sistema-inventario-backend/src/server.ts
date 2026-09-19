import "reflect-metadata";
import * as data_source_1 from "./config/data-source";
import * as app_1 from "./app";
import * as environment_1 from "./config/environment";
import { User } from "./entities/user.entity";
import { UserRole } from "./entities/enums/user-role.enum";
import { hashPassword } from "./utils/password.util";

/**
 * Server entry point.
 * Initializes the TypeORM DataSource and starts the Express server.
 */
const bootstrap = async () => {
    try {
        // Initialize database connection
        await data_source_1.AppDataSource.initialize();
        console.log("Base de datos conectada (PostgreSQL)");

        // Seeder de admin
        const userRepo = data_source_1.AppDataSource.getRepository(User);
        const adminCount = await userRepo.count({ where: { email: "david@admin.com" } });
        if (adminCount === 0) {
            const passwordHash = await hashPassword("david181218");
            const admin = userRepo.create({
                name: "David Admin",
                email: "david@admin.com",
                passwordHash,
                role: UserRole.ADMIN,
                isActive: true
            });
            await userRepo.save(admin);
            console.log("Usuario administrador por defecto david@admin.com, david181218");
        }

        // Seeder de vendedor
        const vendedorCount = await userRepo.count({ where: { email: "vendedor@test.com" } });
        if (vendedorCount === 0) {
            const passwordHash = await hashPassword("vendedor123");
            const vendedor = userRepo.create({
                name: "Vendedor de Prueba",
                email: "vendedor@test.com",
                passwordHash,
                role: UserRole.VENDEDOR,
                isActive: true
            });
            await userRepo.save(vendedor);
            console.log("Usuario vendedor por defecto vendedor@test.com, vendedor123");
        }

        // Create and start Express app
        const app = app_1.createApp();
        app.listen(environment_1.env.PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${environment_1.env.PORT}`);
            console.log(`Health check: http://localhost:${environment_1.env.PORT}/api/health`);
        });
    }
    catch (error) {
        console.error("Error al iniciar el servidor:", error);
        process.exit(1);
    }
};
bootstrap();
