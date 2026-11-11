import "reflect-metadata";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user.entity";
import { UserRole } from "../entities/enums/user-role.enum";
import { hashPassword } from "../utils/password.util";

// Provisionamiento explícito: no reemplaza ni modifica cuentas existentes.
async function main() {
  const name = process.env.INITIAL_ADMIN_NAME?.trim();
  const email = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 180 || !password || password.length < 14 || Buffer.byteLength(password, 'utf8') > 72) {
    throw new Error("Configure INITIAL_ADMIN_NAME, INITIAL_ADMIN_EMAIL y una contraseña de al menos 14 caracteres.");
  }
  await AppDataSource.initialize();
  try {
    const repo = AppDataSource.getRepository(User);
    if (await repo.count({ where: { role: UserRole.ADMIN } })) throw new Error("Ya existe un administrador; no se creó otra cuenta.");
    await repo.save(repo.create({ name, email, passwordHash: await hashPassword(password), role: UserRole.ADMIN, isActive: true }));
    console.log("Administrador inicial creado.");
  } finally { await AppDataSource.destroy(); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
