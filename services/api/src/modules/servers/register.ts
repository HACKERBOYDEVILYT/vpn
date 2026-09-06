import type { FastifyInstance } from "fastify";

import {
  registerServerRoutes
} from "./routes.js";

import {
  registerServerHealthRoute
} from "./health-route.js";

export async function registerServersModule(
  app: FastifyInstance
): Promise<void> {
  await registerServerRoutes(app);
  await registerServerHealthRoute(app);
}
