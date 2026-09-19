import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user.entity";
import { UserRole } from "../entities/enums/user-role.enum";
import { AppError } from "./error.middleware"; // Wait, in tesis-backend it uses AppError, let's adapt

declare global {
  namespace Express {
    interface Request {
      auth?: { userId: string; role: UserRole; sessionToken: string };
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    // Strict check: single-session and active status
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: decoded.userId } });

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "Usuario deshabilitado o no existe" });
    }

    if (user.sessionToken !== decoded.sessionToken) {
      return res.status(401).json({ success: false, message: "Sesión caducada. Has iniciado sesión en otro lado." });
    }

    req.auth = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token inválido o expirado" });
  }
};

export const allowRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return res.status(403).json({ success: false, message: "No tienes permiso para acceder a este recurso" });
    }
    next();
  };
};
