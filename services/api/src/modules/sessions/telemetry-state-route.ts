import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth.js";
import { findSessionById } from "./repository.js";
import { markSessionConnected } from "./telemetry-state-service.js";

const ParamsSchema = z.object({
  sessionId: z.string().uuid()
});

export async function registerSessionConnectedRoute(
  app: FastifyInstance
) {
  app.post(
    "/sessions/:sessionId/connected",
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
        const session = await findSessionById(
          parsed.data.sessionId,
          request.user.id
        );

        if (!session) {
          return reply.code(404).send({
            error: "SESSION_NOT_FOUND"
          });
        }

        if (
          session.state !== "connecting" &&
          session.state !== "reconnecting"
        ) {
          return reply.code(409).send({
            error: "INVALID_SESSION_STATE"
          });
        }

        const telemetry =
          await markSessionConnected(session.id);

        return reply.send({
          success: true,
          data: telemetry
        });
      } catch {
        return reply.code(500).send({
          error: "SESSION_CONNECTED_FAILED"
        });
      }
    }
  );
}
