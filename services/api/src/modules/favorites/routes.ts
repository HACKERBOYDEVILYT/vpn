import type { FastifyInstance } from "fastify";

import { requireAuth } from "../auth/guard.js";

import {
  FavoriteServerSchema
} from "./schema.js";

import {
  listFavorites,
  addFavorite,
  removeFavorite
} from "./repository.js";

export async function registerFavoriteRoutes(
  app: FastifyInstance
): Promise<void> {
  app.get(
    "/favorites",
    {
      preHandler: requireAuth
    },
    async (request) => {
      const favorites =
        await listFavorites(
          request.auth.user.id
        );

      return {
        favorites
      };
    }
  );

  app.post(
    "/favorites",
    {
      preHandler: requireAuth
    },
    async (request, reply) => {
      const input =
        FavoriteServerSchema.parse(
          request.body
        );

      const favorite =
        await addFavorite(
          request.auth.user.id,
          input.serverId
        );

      return reply
        .status(201)
        .send({
          favorite
        });
    }
  );

  app.delete(
    "/favorites/:serverId",
    {
      preHandler: requireAuth
    },
    async (request, reply) => {
      const params =
        FavoriteServerSchema.parse(
          request.params
        );

      const removed =
        await removeFavorite(
          request.auth.user.id,
          params.serverId
        );

      if (!removed) {
        return reply
          .status(404)
          .send({
            code:
              "FAVORITE_NOT_FOUND",
            message:
              "Favorite server not found",
            requestId:
              request.id
          });
      }

      return reply
        .status(204)
        .send();
    }
  );
}
