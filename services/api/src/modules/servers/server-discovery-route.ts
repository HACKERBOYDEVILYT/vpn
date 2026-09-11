import type { FastifyInstance } from "fastify";
import { z } from "zod";

import {
  discoverServers
} from "./server-discovery.js";

const QuerySchema = z.object({
  region: z.string().min(2).max(32).optional(),
  city: z.string().min(1).max(64).optional()
});

export async function registerServerDiscoveryRoute(
  app: FastifyInstance
) {
  app.get(
    "/servers/discover",
    async (request, reply) => {
      const parsed =
        QuerySchema.safeParse(
          request.query
        );

      if (!parsed.success) {
        return reply.code(400).send({
          error: "INVALID_DISCOVERY_QUERY"
        });
      }

      const servers =
        await discoverServers({
          regionCode:
            parsed.data.region,
          city:
            parsed.data.city
        });

      return reply.send({
        success: true,
        count: servers.length,
        data: servers
      });
    }
  );
}
