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
  generateClientVPNConfig
} from "./config-service.js";

const ClientVPNConfigSchema =
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

export async function registerVPNClientConfigRoutes(
  app: FastifyInstance
) {
  app.post(
    "/vpn/client-config",
    {
      preHandler: requireAuth
    },
    async (request, reply) => {
      const parsed =
        ClientVPNConfigSchema.safeParse(
          request.body
        );

      if (!parsed.success) {
        return reply.code(400).send({
          error:
            "INVALID_REQUEST",
          message:
            "Invalid VPN configuration request",
          details:
            parsed.error.flatten()
        });
      }

      try {
        const result =
          await generateClientVPNConfig({
            userId:
              request.user.id,
            deviceId:
              parsed.data.deviceId,
            serverId:
              parsed.data.serverId,
            protocol:
              parsed.data.protocol
          });

        return reply.send({
          success: true,
          data: result
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "VPN_CONFIG_FAILED";

        const statusMap:
          Record<string, number> = {
            DEVICE_NOT_FOUND: 404,
            DEVICE_KEY_NOT_FOUND: 404,
            SERVER_NOT_FOUND: 404,
            SERVER_UNAVAILABLE: 409,
            PROTOCOL_NOT_SUPPORTED: 400
          };

        return reply
          .code(
            statusMap[message] ?? 500
          )
          .send({
            error: message
          });
      }
    }
  );
}
