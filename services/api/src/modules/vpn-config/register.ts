import type { FastifyInstance } from "fastify";

import {
  registerVPNConfigRoutes
} from "./routes.js";

import {
  registerVPNKeyRoutes
} from "./key-routes.js";

export async function registerVPNConfigModule(
  app: FastifyInstance
): Promise<void> {
  await registerVPNConfigRoutes(app);

  await registerVPNKeyRoutes(app);
}
