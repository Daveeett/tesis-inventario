import "reflect-metadata";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user.entity";
import { UserRole } from "../entities/enums/user-role.enum";
import { hashPassword } from "../utils/password.util";

// Restablece la contraseña de un administrador existente en la base de datos LOCAL.
// Uso: definir ADMIN_RESET_EMAIL y ADMIN_RESET_PASSWORD en .env y ejecutar `npm run admin:restablecer`.
// No crea cuentas nuevas y se niega a ejecutarse contra una base remota o en producción.
async function main() {
  if (process.env.NODE_ENV === "production" || process.env.DATABASE_URL || process.env.POSTGRES_URL) {
    throw new Error("Este comando solo se usa con la base de datos local (sin DATABASE_URL/POSTGRES_URL y fuera de producción).");
  }
  const email = process.env.ADMIN_RESET_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_RESET_PASSWORD;
  if (!email || !password || password.length < 14 || Buffer.byteLength(password, "utf8") > 72) {
    throw new Error("Configure ADMIN_RESET_EMAIL y ADMIN_RESET_PASSWORD (al menos 14 caracteres) en el archivo .env.");
  }

  await AppDataSource.initialize();
  try {
    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOne({ where: { email, role: UserRole.ADMIN } });
    if (!user) throw new Error(`No existe un administrador con el correo ${email}.`);

    user.passwordHash = await hashPassword(password);
    user.isActive = true;
    user.sessionToken = null;   // cierra cualquier sesión anterior
    user.failedAttempts = 0;    // quita un posible bloqueo por intentos fallidos
    user.lockedUntil = null;
    await repo.save(user);
    console.log(`Contraseña restablecida para ${email}. Ya puede borrar ADMIN_RESET_PASSWORD del archivo .env.`);
  } finally {
    await AppDataSource.destroy();
  }
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
