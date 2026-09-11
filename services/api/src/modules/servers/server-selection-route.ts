import type { FastifyInstance } from "fastify";
import { ServerSelectionQuerySchema } from "./server-selection-schema.js";
import { chooseServer } from "./server-selection-service.js";
import { getHealthState } from "./server-health-state.js";
import { queryServers } from "./server-query.js";
import { serverRepository } from "./repository.js";

export async function registerServerSelectionRoute(
  app: FastifyInstance
) {
  app.get("/servers/select", async (request, reply) => {
    const parsed =
      ServerSelectionQuerySchema.safeParse(
        request.query
      );

    if (!parsed.success) {
      return reply.code(400).send({
        error: "INVALID_SELECTION_QUERY",
        details: parsed.error.flatten()
      });
    }

    const servers = await queryServers(
      serverRepository,
      {
        regionCode: parsed.data.region,
        city: parsed.data.city,
        enabledOnly: true
      }
    );

    const candidates = servers.map((server: any) => ({
      id: server.id,
      regionCode: server.regionCode ?? "",
      city: server.city ?? "",
      enabled: server.enabled !== false,
      healthy:
        getHealthState(
          server.latencyMs ?? null,
          server.loadPercent ?? null
        ) !== "unhealthy",
      loadPercent: server.loadPercent ?? 0,
      latencyMs: server.latencyMs ?? null
    }));

    const selected = chooseServer(
      candidates,
      parsed.data.mode
    );

    if (!selected) {
      return reply.code(503).send({
        error: "NO_SERVER_AVAILABLE"
      });
    }

    return reply.send({
      success: true,
      data: selected
    });
  });
}
