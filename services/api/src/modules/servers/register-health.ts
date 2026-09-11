import type { FastifyInstance } from "fastify";
import { registerServerHealthRoute } from "./server-health-route.js";

export async function registerServerHealth(
  app: FastifyInstance
) {
  await registerServerHealthRoute(app);
}
