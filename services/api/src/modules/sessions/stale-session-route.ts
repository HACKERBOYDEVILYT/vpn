import type { FastifyInstance } from "fastify";
import { requireAuth } from "../../middleware/auth.js";
import { findStaleVPNSessions } from "./stale-session-service.js";

export async function registerStaleSessionRoute(
  app: FastifyInstance
) {
  app.get(
    "/sessions/stale",
    {
      preHandler: requireAuth
    },
    async (_request, reply) => {
      try {
        const sessions = await findStaleVPNSessions();

        return reply.send({
          success: true,
          data: {
            count: sessions.length,
            sessions
          }
        });
      } catch {
        return reply.code(500).send({
          error: "STALE_SESSION_CHECK_FAILED"
        });
      }
    }
  );
}
