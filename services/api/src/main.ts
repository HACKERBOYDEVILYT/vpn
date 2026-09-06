import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import sensible from "@fastify/sensible";

const app = Fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug"
  },
  trustProxy: true
});

async function buildServer() {
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

async function start() {
  try {
    await buildServer();

    const port = Number(process.env.API_PORT ?? 4000);
    const host = process.env.API_HOST ?? "0.0.0.0";

    await app.listen({
      port,
      host
    });

    app.log.info(`NexaVPN API running on ${host}:${port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void start();
