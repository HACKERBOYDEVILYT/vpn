import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  API_PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(4000),

  API_HOST: z
    .string()
    .default("0.0.0.0"),

  API_URL: z
    .string()
    .url()
    .default("http://localhost:4000"),

  WEB_URL: z
    .string()
    .url()
    .default("http://localhost:5173"),

  ADMIN_URL: z
    .string()
    .url()
    .default("http://localhost:5174"),

  DATABASE_URL: z
    .string()
    .min(1),

  REDIS_URL: z
    .string()
    .min(1),

  SESSION_SECRET: z
    .string()
    .min(32),

  JWT_SECRET: z
    .string()
    .min(32),

  VPN_CONTROL_PLANE_URL: z
    .string()
    .url(),

  PAYMENT_PROVIDER_SECRET: z
    .string()
    .optional(),

  EMAIL_PROVIDER_API_KEY: z
    .string()
    .optional(),

  SENTRY_DSN: z
    .string()
    .url()
    .optional()
});

const parsedEnv = EnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "Invalid environment configuration:"
  );

  console.error(
    parsedEnv.error.flatten().fieldErrors
  );

  process.exit(1);
}

export const env = parsedEnv.data;

export type Env = typeof env;
