import { Router, Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { AuthService } from "../services/auth.service";
import { requireAuth } from "../middlewares/auth.middleware";

/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios Administrativos y Cajeros
 */

const authService = new AuthService();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Demasiados intentos. Intenta en 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRoutes = Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Iniciar Sesión en el Panel
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: david@admin.com
 *               password:
 *                 type: string
 *                 example: david181218
 *     responses:
 *       200:
 *         description: Login exitoso, retorna el JWT token
 *       401:
 *         description: Credenciales inválidas
 */
authRoutes.post("/login", authLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const ip = (req.headers["x-forwarded-for"] as string) || req.ip || "unknown";
    const result = await authService.login(email, password, ip);
    res.status(200).json({ success: true, message: "Login exitoso", data: result });
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar la sesión actual destruyendo el Session Token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 */
authRoutes.post("/logout", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.auth!.userId;
    await authService.revokeSession(userId);
    res.status(200).json({ success: true, message: "Sesión cerrada", data: null });
  } catch (err) {
    next(err);
  }
});
