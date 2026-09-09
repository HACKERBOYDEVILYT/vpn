import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth.js";
import { heartbeatVPNSession } from "./heartbeat-service.js";

const ParamsSchema = z.object({
  sessionId: z.string().uuid()
});

export async function registerSessionHeartbeatRoute(
  app: FastifyInstance
) {
  app.post(
    "/sessions/:sessionId/heartbeat",
    {
      preHandler: requireAuth
    },
    async (request, reply) => {
      const parsed = ParamsSchema.safeParse(request.params);

      if (!parsed.success) {
        return reply.code(400).send({
          error: "INVALID_SESSION_ID"
        });
      }

      try {
        const result = await heartbeatVPNSession({
          userId: request.user.id,
          sessionId: parsed.data.sessionId
        });

        return reply.send({
          success: true,
          data: result
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "HEARTBEAT_FAILED";

        if (message === "SESSION_NOT_FOUND") {
          return reply.code(404).send({
            error: message
          });
        }

        if (message === "SESSION_NOT_ACTIVE") {
          return reply.code(409).send({
            error: message
          });
        }

        return reply.code(500).send({
          error: "HEARTBEAT_FAILED"
        });
      }
    }
  );
}
