import type { FastifyInstance } from "fastify";
import { z } from "zod";

import {
  getServerHealth
} from "./health-service.js";

const ParamsSchema = z.object({
  serverId: z.string().uuid()
});

export async function registerServerHealthRoute(
  app: FastifyInstance
) {
  app.get(
    "/servers/:serverId/health",
    async (request, reply) => {
      const parsed =
        ParamsSchema.safeParse(
          request.params
        );

      if (!parsed.success) {
        return reply.code(400).send({
          error: "INVALID_SERVER_ID"
        });
      }

      const health =
        await getServerHealth(
          parsed.data.serverId
        );

      return reply.send({
        success: true,
        data: health
      });
    }
  );
}
