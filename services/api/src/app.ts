import Fastify, {
  type FastifyInstance
} from "fastify";

import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import sensible from "@fastify/sensible";

import { env } from "./config/env.js";

import {
  registerAuthModule,
  registerMeRoute,
  registerUsersModule,
  registerDevicesModule,
  registerServersModule,
  registerFavoritesModule,
  registerSessionsModule,
  registerVPNConfigModule
} from "./modules/index.js";

import {
  registerErrorHandler
} from "./middleware/index.js";

export async function createApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level:
        env.NODE_ENV === "production"
          ? "info"
          : "debug"
    },

    trustProxy: true,

    requestIdHeader:
      "x-request-id"
  });

  await app.register(helmet, {
    global: true
  });

  await app.register(cors, {
    origin: [
      env.WEB_URL,
      env.ADMIN_URL
    ],
    credentials: true
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute"
  });

  await app.register(sensible);

  registerErrorHandler(app);

  app.get(
    "/health",
    async () => {
      return {
        status: "ok",
        service: "nexavpn-api",
        timestamp:
          new Date().toISOString()
      };
    }
  );

  app.get(
    "/ready",
    async () => {
      return {
        status: "ready",
        service: "nexavpn-api"
      };
    }
  );

  await registerAuthModule(app);

  await registerMeRoute(app);

  await registerUsersModule(app);

  await registerDevicesModule(app);

  await registerServersModule(app);

  await registerFavoritesModule(app);

  await registerSessionsModule(app);

  await registerVPNConfigModule(app);

  return app;
}
