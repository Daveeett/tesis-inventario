import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

/** Zod schema to validate and parse environment variables */
const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  FRONTEND_BASE_URL: z.string().default("http://localhost:4200"),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string().default("postgres"),
  DB_DATABASE: z.string().default("innovatecno_inventario"),
  DB_SSL: z
    .string()
    .optional()
    .transform((val) => val === "true" || val === "1"),
});

export const env = envSchema.parse(process.env);
