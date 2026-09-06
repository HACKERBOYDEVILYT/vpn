import type {
  FastifyInstance
} from "fastify";

import {
  requireAuth
} from "../auth/guard.js";

import {
  ServerIdSchema
} from "./schema.js";

import {
  getServerHealth
} from "./health.js";

export async function registerServerHealthRoute(
  app: FastifyInstance
): Promise<void> {
  app.get(
    "/servers/:serverId/health",
    {
      preHandler: requireAuth
    },
    async (request, reply) => {
      const params =
        ServerIdSchema.parse(
          request.params
        );

      const health =
        await getServerHealth(
          params.serverId
        );

      if (!health) {
        return reply.status(404).send({
          code: "SERVER_HEALTH_NOT_FOUND",
          message:
            "Server health information not available",
          requestId: request.id
        });
      }

      return {
        health
      };
    }
  );
}
