import "reflect-metadata";
import { AppDataSource } from "../src/config/data-source";
import { createApp } from "../src/app";

const app = createApp();
let connection: Promise<unknown> | undefined;

export default async function handler(req: any, res: any) {
  try {
    if (!AppDataSource.isInitialized) {
      connection ??= AppDataSource.initialize().catch((error) => {
        connection = undefined;
        throw error;
      });
      await connection;
    }
    return app(req, res);
  } catch {
    return res.status(503).json({ success: false, message: "Servicio temporalmente no disponible" });
  }
}
