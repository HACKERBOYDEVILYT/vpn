import type { FastifyInstance } from "fastify";

import {
  registerDeviceRoutes
} from "./routes.js";

export async function registerDevicesModule(
  app: FastifyInstance
): Promise<void> {
  await registerDeviceRoutes(app);
}
