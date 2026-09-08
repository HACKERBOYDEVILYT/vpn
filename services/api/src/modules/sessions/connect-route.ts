import type {
  FastifyInstance
} from "fastify";

import {
  z
} from "zod";

import {
  requireAuth
} from "../../middleware/auth.js";

import {
  connectVPNSession
} from "./connect-service.js";

const ConnectSchema =
  z.object({
    deviceId:
      z.string().uuid(),

    serverId:
      z.string().uuid(),

    protocol:
      z.enum([
        "wireguard",
        "openvpn",
        "ikev2"
      ])
  });

export async function registerConnectRoute(
  app: FastifyInstance
) {
  app.post(
    "/sessions/connect",
    {
      preHandler: requireAuth
    },
    async (
      request,
      reply
    ) => {
      const parsed =
        ConnectSchema.safeParse(
          request.body
        );

      if (!parsed.success) {
        return reply
          .code(400)
          .send({
            error:
              "INVALID_REQUEST",
            details:
              parsed.error.flatten()
          });
      }

      try {
        const result =
          await connectVPNSession({
            userId:
              request.user.id,
            deviceId:
              parsed.data.deviceId,
            serverId:
              parsed.data.serverId,
            protocol:
              parsed.data.protocol
          });

        return reply
          .code(201)
          .send({
            success: true,
            data: result
          });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "CONNECT_FAILED";

        if (
          message ===
          "DEVICE_ALREADY_CONNECTED"
        ) {
          return reply
            .code(409)
            .send({
              error: message
            });
        }

        if (
          message ===
            "DEVICE_NOT_FOUND" ||
          message ===
            "SERVER_NOT_FOUND"
        ) {
          return reply
            .code(404)
            .send({
              error: message
            });
        }

        if (
          message ===
          "SERVER_UNAVAILABLE"
        ) {
          return reply
            .code(409)
            .send({
              error: message
            });
        }

        return reply
          .code(500)
          .send({
            error:
              "CONNECT_FAILED"
          });
      }
    }
  );
}
