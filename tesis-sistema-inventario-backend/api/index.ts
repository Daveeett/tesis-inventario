import "reflect-metadata";
import { AppDataSource } from "../src/config/data-source";
import { createApp } from "../src/app";
import { User } from "../src/entities/user.entity";
import { UserRole } from "../src/entities/enums/user-role.enum";
import { hashPassword } from "../src/utils/password.util";

const app = createApp();

export default async function handler(req: any, res: any) {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log("Base de datos conectada en Vercel Serverless Function");

      // Seeder automático de usuarios iniciales en cold-start
      const userRepo = AppDataSource.getRepository(User);
      const adminCount = await userRepo.count({ where: { email: "david@admin.com" } });
      if (adminCount === 0) {
        const passwordHash = await hashPassword("david181218");
        const admin = userRepo.create({
          name: "David Admin",
          email: "david@admin.com",
          passwordHash,
          role: UserRole.ADMIN,
          isActive: true,
        });
        await userRepo.save(admin);
        console.log("Usuario admin creado en Vercel");
      }

      const vendedorCount = await userRepo.count({ where: { email: "vendedor@test.com" } });
      if (vendedorCount === 0) {
        const passwordHash = await hashPassword("vendedor123");
        const vendedor = userRepo.create({
          name: "Vendedor de Prueba",
          email: "vendedor@test.com",
          passwordHash,
          role: UserRole.VENDEDOR,
          isActive: true,
        });
        await userRepo.save(vendedor);
        console.log("Usuario vendedor creado en Vercel");
      }
    } catch (error) {
      console.error("Error al conectar la base de datos en Vercel:", error);
    }
  }

  return app(req, res);
}
