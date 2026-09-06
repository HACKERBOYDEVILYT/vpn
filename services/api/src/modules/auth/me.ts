import type {
  FastifyInstance
} from "fastify";

import {
  requireAuth
} from "./guard.js";

export async function registerMeRoute(
  app: FastifyInstance
): Promise<void> {
  app.get(
    "/auth/me",
    {
      preHandler: requireAuth
    },
    async (request) => {
      return {
        user: request.auth.user
      };
    }
  );
}
