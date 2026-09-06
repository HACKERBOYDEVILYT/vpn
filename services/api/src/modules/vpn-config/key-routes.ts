import type { FastifyInstance } from "fastify";

import {
  requireAuth
} from "../auth/guard.js";

import {
  z
} from "zod";

import {
  getOrCreateDeviceKey
} from "./key-service.js";

const DeviceKeyRequestSchema =
  z.object({
    deviceId: z
      .string()
      .min(1)
      .max(128)
  });

export async function registerVPNKeyRoutes(
  app: FastifyInstance
): Promise<void> {
  app.post(
    "/vpn/device-key",
    {
      preHandler: requireAuth
    },
    async (
      request,
      reply
    ) => {
      const input =
        DeviceKeyRequestSchema.parse(
          request.body
        );

      try {
        const key =
          await getOrCreateDeviceKey(
            request.auth.user.id,
            input.deviceId
          );

        /*
         * Never return the encrypted
         * private key to the client.
         */
        return reply.send({
          key: {
            id: key.id,
            deviceId:
              key.deviceId,
            keyType:
              key.keyType,
            publicKey:
              key.publicKey,
            createdAt:
              key.createdAt,
            rotatedAt:
              key.rotatedAt
          }
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message ===
            "DEVICE_NOT_FOUND"
        ) {
          return reply
            .status(404)
            .send({
              code:
                "DEVICE_NOT_FOUND",
              message:
                "Device not found",
              requestId:
                request.id
            });
        }

        throw error;
      }
    }
  );
}
