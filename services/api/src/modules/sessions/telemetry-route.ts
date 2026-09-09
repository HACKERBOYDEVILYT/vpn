import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth.js";
import {
  getVPNSessionTelemetry,
  reportVPNSessionTelemetry
} from "./telemetry-service.js";

const ParamsSchema = z.object({
  sessionId: z.string().uuid()
});

const ReportSchema = z.object({
  bytesIn: z.number().int().nonnegative(),
  bytesOut: z.number().int().nonnegative(),
  packetsIn: z.number().int().nonnegative(),
  packetsOut: z.number().int().nonnegative()
});

export async function registerSessionTelemetryRoute(
  app: FastifyInstance
) {
  app.get(
    "/sessions/:sessionId/telemetry",
    {
      preHandler: requireAuth
    },
    async (request, reply) => {
      const params = ParamsSchema.safeParse(
        request.params
      );

      if (!params.success) {
        return reply.code(400).send({
          error: "INVALID_SESSION_ID"
        });
      }

      try {
        const telemetry =
          await getVPNSessionTelemetry({
            userId: request.user.id,
            sessionId: params.data.sessionId
          });

        return reply.send({
          success: true,
          data: telemetry
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "TELEMETRY_FETCH_FAILED";

        if (message === "SESSION_NOT_FOUND") {
          return reply.code(404).send({
            error: message
          });
        }

        return reply.code(500).send({
          error: "TELEMETRY_FETCH_FAILED"
        });
      }
    }
  );

  app.post(
    "/sessions/:sessionId/telemetry",
    {
      preHandler: requireAuth
    },
    async (request, reply) => {
      const params = ParamsSchema.safeParse(
        request.params
      );

      if (!params.success) {
        return reply.code(400).send({
          error: "INVALID_SESSION_ID"
        });
      }

      const body = ReportSchema.safeParse(
        request.body
      );

      if (!body.success) {
        return reply.code(400).send({
          error: "INVALID_TELEMETRY",
          details: body.error.flatten()
        });
      }

      try {
        const telemetry =
          await reportVPNSessionTelemetry({
            userId: request.user.id,
            sessionId: params.data.sessionId,
            ...body.data
          });

        return reply.send({
          success: true,
          data: telemetry
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "TELEMETRY_REPORT_FAILED";

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

        if (message === "INVALID_TELEMETRY") {
          return reply.code(400).send({
            error: message
          });
        }

        return reply.code(500).send({
          error: "TELEMETRY_REPORT_FAILED"
        });
      }
    }
  );
}
