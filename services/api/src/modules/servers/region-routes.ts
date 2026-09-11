import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  findRegion,
  listCities,
  listRegions
} from "./region-service.js";

const RegionParams = z.object({
  code: z.string().min(2).max(32)
});

export async function registerServerRegionRoutes(
  app: FastifyInstance
) {
  app.get("/servers/regions", async (_request, reply) => {
    return reply.send({
      success: true,
      data: listRegions()
    });
  });

  app.get(
    "/servers/regions/:code/cities",
    async (request, reply) => {
      const parsed = RegionParams.safeParse(request.params);

      if (!parsed.success) {
        return reply.code(400).send({
          error: "INVALID_REGION"
        });
      }

      const region = findRegion(parsed.data.code);

      if (!region || !region.enabled) {
        return reply.code(404).send({
          error: "REGION_NOT_FOUND"
        });
      }

      return reply.send({
        success: true,
        data: listCities(region.code)
      });
    }
  );
}
