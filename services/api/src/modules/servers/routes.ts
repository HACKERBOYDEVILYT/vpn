import type { FastifyInstance } from "fastify";

import {
  requireAuth
} from "../auth/guard.js";

import {
  ServerIdSchema,
  ServerQuerySchema
} from "./schema.js";

import {
  listServers,
  findServerById
} from "./repository.js";

export async function registerServerRoutes(
  app: FastifyInstance
): Promise<void> {
  app.get(
    "/servers",
    {
      preHandler: requireAuth
    },
    async (request) => {
      const query =
        ServerQuerySchema.parse(
          request.query
        );

      return listServers(query);
    }
  );

  app.get(
    "/servers/:serverId",
    {
      preHandler: requireAuth
    },
    async (request, reply) => {
      const params =
        ServerIdSchema.parse(
          request.params
        );

      const server =
        await findServerById(
          params.serverId
        );

      if (!server) {
        return reply.status(404).send({
          code: "SERVER_NOT_FOUND",
          message: "VPN server not found",
          requestId: request.id
        });
      }

      return {
        server
      };
    }
  );
}
