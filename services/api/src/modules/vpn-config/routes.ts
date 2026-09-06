import type { FastifyInstance } from "fastify";

import {
  requireAuth
} from "../auth/guard.js";

import {
  VPNConfigRequestSchema
} from "./schema.js";

import {
  generateVPNConfig
} from "./service.js";

export async function registerVPNConfigRoutes(
  app: FastifyInstance
): Promise<void> {
  app.post(
    "/vpn/config",
    {
      preHandler: requireAuth
    },
    async (request, reply) => {
      const input =
        VPNConfigRequestSchema.parse(
          request.body
        );

      try {
        const config =
          await generateVPNConfig({
            serverId:
              input.serverId,
            protocol:
              input.protocol
          });

        return reply.send({
          config
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message ===
            "SERVER_NOT_FOUND"
        ) {
          return reply
            .status(404)
            .send({
              code:
                "SERVER_NOT_FOUND",
              message:
                "VPN server not found",
              requestId:
                request.id
            });
        }

        if (
          error instanceof Error &&
          error.message ===
            "SERVER_UNAVAILABLE"
        ) {
          return reply
            .status(409)
            .send({
              code:
                "SERVER_UNAVAILABLE",
              message:
                "VPN server is currently unavailable",
              requestId:
                request.id
            });
        }

        if (
          error instanceof Error &&
          error.message ===
            "PROTOCOL_NOT_SUPPORTED"
        ) {
          return reply
            .status(400)
            .send({
              code:
                "PROTOCOL_NOT_SUPPORTED",
              message:
                "Selected VPN protocol is not supported by this server",
              requestId:
                request.id
            });
        }

        throw error;
      }
    }
  );
}
