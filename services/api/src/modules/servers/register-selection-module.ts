import type { FastifyInstance } from "fastify";
import { registerServerSelection } from "./register-selection.js";

export async function registerSelectionModule(
  app: FastifyInstance
) {
  await registerServerSelection(app);
}
