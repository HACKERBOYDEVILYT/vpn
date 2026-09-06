import type { FastifyInstance } from "fastify";

import {
  registerSessionRoutes
} from "./routes.js";

export async function registerSessionsModule(
  app: FastifyInstance
): Promise<void> {
  await registerSessionRoutes(app);
}
