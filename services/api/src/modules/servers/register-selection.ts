import type { FastifyInstance } from "fastify";
import { registerServerSelectionRoute } from "./server-selection-route.js";

export async function registerServerSelection(
  app: FastifyInstance
) {
  await registerServerSelectionRoute(app);
}
