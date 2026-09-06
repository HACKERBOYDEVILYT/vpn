import type {
  FastifyInstance
} from "fastify";

import {
  requireAuth
} from "../auth/guard.js";

import {
  getUserProfile,
  updateUserProfile
} from "./repository.js";

import {
  UpdateUserProfileSchema
} from "./schema.js";

export async function registerUserRoutes(
  app: FastifyInstance
): Promise<void> {
  app.get(
    "/users/me",
    {
      preHandler: requireAuth
    },
    async (request, reply) => {
      const user =
        await getUserProfile(
          request.auth.user.id
        );

      if (!user) {
        return reply.status(404).send({
          code: "USER_NOT_FOUND",
          message: "User not found",
          requestId: request.id
        });
      }

      return {
        user
      };
    }
  );

  app.patch(
    "/users/me",
    {
      preHandler: requireAuth
    },
    async (request, reply) => {
      const input =
        UpdateUserProfileSchema.parse(
          request.body
        );

      const user =
        await updateUserProfile(
          request.auth.user.id,
          input
        );

      if (!user) {
        return reply.status(404).send({
          code: "USER_NOT_FOUND",
          message: "User not found",
          requestId: request.id
        });
      }

      return {
        user
      };
    }
  );
}
