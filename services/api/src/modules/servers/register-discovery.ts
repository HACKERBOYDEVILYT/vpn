import type { FastifyInstance } from "fastify";
import { registerServerDiscoveryRoute } from "./server-discovery-route.js";

export async function registerServerDiscovery(
  app: FastifyInstance
) {
  await registerServerDiscoveryRoute(app);
}
