import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth.js";
import {
  getVPNSessionUsageSummary
} from "./telemetry-summary-service.js";

const ParamsSchema = z.object({
  sessionId: z.string().uuid()
});

export async function registerSessionTelemetrySummaryRoute(
  app: FastifyInstance
) {
  app.get(
    "/sessions/:sessionId/usage",
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
        const result =
          await getVPNSessionUsageSummary({
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
            : "SESSION_USAGE_FAILED";

        if (message === "SESSION_NOT_FOUND") {
          return reply.code(404).send({
            error: message
          });
        }

        return reply.code(500).send({
          error: "SESSION_USAGE_FAILED"
        });
      }
    }
  );
}
