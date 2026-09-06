import type {
  FastifyInstance
} from "fastify";

import {
  registerAuthRoutes
} from "./routes.js";

export async function registerAuthModule(
  app: FastifyInstance
): Promise<void> {
  await registerAuthRoutes(app);
}
