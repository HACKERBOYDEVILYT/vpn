import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import sensible from "@fastify/sensible";

export async function createApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level:
        process.env.NODE_ENV === "production"
          ? "info"
          : "debug"
    },
    trustProxy: true
  });

  await app.register(helmet, {
    global: true
  });

  await app.register(cors, {
    origin: [
      process.env.WEB_URL ?? "http://localhost:5173",
      process.env.ADMIN_URL ?? "http://localhost:5174"
    ],
    credentials: true
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute"
  });

  await app.register(sensible);

  app.get("/health", async () => {
    return {
      status: "ok",
      service: "nexavpn-api",
      timestamp: new Date().toISOString()
    };
  });

  app.get("/ready", async () => {
    return {
      status: "ready",
      service: "nexavpn-api"
    };
  });

  return app;
}
