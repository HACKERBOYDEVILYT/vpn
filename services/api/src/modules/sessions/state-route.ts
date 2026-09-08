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
  transitionSession
} from "./state-service.js";

const SessionStateSchema =
  z.object({
    sessionId:
      z.string().uuid(),

    state:
      z.enum([
        "connected",
        "reconnecting",
        "failed"
      ])
  });

export async function registerSessionStateRoute(
  app: FastifyInstance
) {
  app.post(
    "/sessions/state",
    {
      preHandler: requireAuth
    },
    async (
      request,
      reply
    ) => {
      const parsed =
        SessionStateSchema.safeParse(
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
          await transitionSession({
            userId:
              request.user.id,
            sessionId:
              parsed.data.sessionId,
            nextState:
              parsed.data.state
          });

        return reply.send({
          success: true,
          data: session
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "SESSION_STATE_FAILED";

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

        if (
          message ===
          "INVALID_SESSION_TRANSITION"
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
              "SESSION_STATE_FAILED"
          });
      }
    }
  );
}
