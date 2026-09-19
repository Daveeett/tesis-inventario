import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/environment";
import { router } from "./routes";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { swaggerSpec } from "./docs/swagger";

/**
 * Factory function to create and configure the Express application.
 * Applies security, compression, rate-limiting, and API routes.
 */
const createApp = () => {
    const app = express();
    // Security headers
    app.use(helmet());
    // CORS for Angular frontend
    app.use(cors({
        origin: "*", // Permite acceso desde cualquier IP (ej. móvil)
    }));
    // Gzip compression
    app.use(compression());
    // JSON body parser (5mb para soportar imágenes Base64)
    app.use(express.json({ limit: "5mb" }));
    // Rate limiting on API routes
    app.use("/api", rateLimit({
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 600,
        standardHeaders: true,
        legacyHeaders: false,
    }));
    // Health check endpoint
    app.get("/api/health", (_req, res) => {
        res.status(200).json({
            success: true,
            message: "Backend operativo",
            data: {
                service: "tesis-sistema-inventario-backend",
                version: "1.0.0",
            },
        });
    });

    // Swagger Documentation Endpoints
    app.get("/api/docs.json", (_req, res) => {
        res.status(200).json(swaggerSpec);
    });
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // API routes
    app.use("/api", router);
    app.use(notFoundHandler);
    app.use(errorHandler);
    return app;
};
export { createApp };
