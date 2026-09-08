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
  disconnectVPNSession
} from "./disconnect-service.js";

const DisconnectSchema =
  z.object({
    sessionId:
      z.string().uuid()
  });

export async function registerDisconnectRoute(
  app: FastifyInstance
) {
  app.post(
    "/sessions/disconnect",
    {
      preHandler: requireAuth
    },
    async (
      request,
      reply
    ) => {
      const parsed =
        DisconnectSchema.safeParse(
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
        const session =
          await disconnectVPNSession({
            userId:
              request.user.id,
            sessionId:
              parsed.data.sessionId
          });

        return reply.send({
          success: true,
          data: session
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "DISCONNECT_FAILED";

        if (
          message ===
          "SESSION_NOT_FOUND"
        ) {
          return reply
            .code(404)
            .send({
              error: message
            });
        }

        return reply
          .code(500)
          .send({
            error:
              "DISCONNECT_FAILED"
          });
      }
    }
  );
}
