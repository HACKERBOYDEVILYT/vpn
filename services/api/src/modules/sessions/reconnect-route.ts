import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth.js";
import { reconnectVPNSession } from "./reconnect-service.js";

const ParamsSchema = z.object({
  sessionId: z.string().uuid()
});

export async function registerReconnectRoute(
  app: FastifyInstance
) {
  app.post(
    "/sessions/:sessionId/reconnect",
    {
      preHandler: requireAuth
    },
    async (request, reply) => {
      const parsed = ParamsSchema.safeParse(
        request.params
      );

      if (!parsed.success) {
        return reply.code(400).send({
          error: "INVALID_SESSION_ID"
        });
      }

      try {
        const result = await reconnectVPNSession({
          userId: request.user.id,
          sessionId: parsed.data.sessionId
        });

        return reply.code(200).send({
          success: true,
          data: result
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "RECONNECT_FAILED";

        if (message === "SESSION_NOT_FOUND") {
          return reply.code(404).send({
            error: message
          });
        }

        if (message === "SESSION_NOT_RECONNECTABLE") {
          return reply.code(409).send({
            error: message
          });
        }

        if (message === "SERVER_NOT_FOUND") {
          return reply.code(404).send({
            error: message
          });
        }

        if (message === "SERVER_UNAVAILABLE") {
          return reply.code(409).send({
            error: message
          });
        }

        return reply.code(500).send({
          error: "RECONNECT_FAILED"
        });
      }
    }
  );
}
