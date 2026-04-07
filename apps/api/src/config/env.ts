import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5434/altum_reboque"),
  JWT_SECRET: z.string().min(8).default("altum-dev-secret"),
  FRONTEND_URL: z.string().default("http://localhost:5173"),
});

export const env = envSchema.parse(process.env);
