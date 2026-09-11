import type { FastifyInstance } from "fastify";
import { registerServerRegionRoutes } from "./region-routes.js";

export async function registerServerRegionModule(
  app: FastifyInstance
) {
  await registerServerRegionRoutes(app);
}
