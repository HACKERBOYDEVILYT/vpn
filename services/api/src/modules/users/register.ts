import type { FastifyInstance } from "fastify";

import {
  registerUserRoutes
} from "./routes.js";

export async function registerUsersModule(
  app: FastifyInstance
): Promise<void> {
  await registerUserRoutes(app);
}
