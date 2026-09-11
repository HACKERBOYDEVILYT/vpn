import type { FastifyInstance } from "fastify";
import { registerServerRegions } from "./register-regions.js";

export async function registerRegionModule(
  app: FastifyInstance
) {
  await registerServerRegions(app);
}
