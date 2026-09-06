import type { FastifyInstance } from "fastify";

import {
  registerVPNConfigRoutes
} from "./routes.js";

export async function registerVPNConfigModule(
  app: FastifyInstance
): Promise<void> {
  await registerVPNConfigRoutes(app);
}
