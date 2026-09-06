import type { FastifyInstance } from "fastify";

import {
  registerFavoriteRoutes
} from "./routes.js";

export async function registerFavoritesModule(
  app: FastifyInstance
): Promise<void> {
  await registerFavoriteRoutes(app);
}
