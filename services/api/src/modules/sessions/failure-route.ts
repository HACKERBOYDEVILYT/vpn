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
  failVPNSession
} from "./failure-service.js";

const FailureSchema =
  z.object({
    sessionId:
      z.string().uuid()
  });

export async function registerFailureRoute(
  app: FastifyInstance
) {
  app.post(
    "/sessions/failure",
    {
      preHandler: requireAuth
    },
    async (
      request,
      reply
    ) => {
      const parsed =
        FailureSchema.safeParse(
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
          await failVPNSession({
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
            : "SESSION_FAILURE";

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
              "SESSION_FAILURE"
          });
      }
    }
  );
}
