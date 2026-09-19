import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user.entity";
import { comparePassword, hashPassword } from "../utils/password.util";
import { AppError } from "../middlewares/error.middleware";
import { signToken } from "../utils/jwt.util";
import { v4 as randomUUID } from "uuid";

// In-memory IP lockout store
const ipAttempts = new Map<string, { count: number; until: number }>();
const MAX_IP_ATTEMPTS = 10;
const IP_LOCKOUT_MS = 15 * 60 * 1000;

export class AuthService {
  private readonly userRepo = AppDataSource.getRepository(User);

  async login(email: string, password: string, ip: string) {
    const ipEntry = ipAttempts.get(ip);
    if (ipEntry && ipEntry.until > Date.now()) {
      const remaining = Math.ceil((ipEntry.until - Date.now()) / 60000);
      throw new AppError(429, `Demasiados intentos desde esta dirección. Intenta en ${remaining} min.`);
    }

    const user = await this.userRepo.findOne({ where: { email } });

    const recordIpFail = () => {
      const e = ipAttempts.get(ip) ?? { count: 0, until: 0 };
      e.count++;
      if (e.count >= MAX_IP_ATTEMPTS) {
        e.until = Date.now() + IP_LOCKOUT_MS;
        e.count = 0;
      }
      ipAttempts.set(ip, e);
    };

    if (!user || !user.isActive) {
      recordIpFail();
      throw new AppError(401, "Credenciales inválidas");
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      throw new AppError(423, `Cuenta bloqueada. Intenta en ${remaining} minutos.`);
    }

    const isValid = await comparePassword(password, user.passwordHash);

    if (!isValid) {
      recordIpFail();
      user.failedAttempts = (user.failedAttempts ?? 0) + 1;

      if (user.failedAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        user.failedAttempts = 0;
        await this.userRepo.save(user);
        throw new AppError(423, "Cuenta bloqueada por 15 minutos por demasiados intentos fallidos.");
      }

      await this.userRepo.save(user);
      throw new AppError(401, `Credenciales inválidas.`);
    }

    const sessionToken = randomUUID();
    user.failedAttempts = 0;
    user.lockedUntil = null;
    user.sessionToken = sessionToken;
    await this.userRepo.save(user);

    ipAttempts.delete(ip);

    const token = signToken({ userId: user.id, role: user.role, sessionToken });

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  async revokeSession(userId: string): Promise<void> {
    await this.userRepo.update(userId, { sessionToken: null });
  }
}
