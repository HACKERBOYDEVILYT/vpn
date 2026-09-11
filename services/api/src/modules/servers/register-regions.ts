import type { FastifyInstance } from "fastify";
import { registerRegionController } from "./region-controller.js";

export async function registerServerRegions(
  app: FastifyInstance
) {
  await registerRegionController(app);
}
