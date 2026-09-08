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
  releaseAllocatedAddress
} from "./address-service.js";

const ReleaseAddressSchema =
  z.object({
    deviceId:
      z.string().uuid(),

    serverId:
      z.string().uuid()
  });

export async function registerVPNAddressRoutes(
  app: FastifyInstance
) {
  app.post(
    "/vpn/address/release",
    {
      preHandler: requireAuth
    },
    async (request, reply) => {
      const parsed =
        ReleaseAddressSchema.safeParse(
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
        await releaseAllocatedAddress({
          userId:
            request.user.id,
          deviceId:
            parsed.data.deviceId,
          serverId:
            parsed.data.serverId
        });

        return reply.send({
          success: true
        });
      } catch {
        return reply
          .code(500)
          .send({
            error:
              "ADDRESS_RELEASE_FAILED"
          });
      }
    }
  );
}
