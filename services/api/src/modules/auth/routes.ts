import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest
} from "fastify";

import {
  LoginSchema,
  RegisterSchema
} from "@nexavpn/validation";

import {
  loginUser,
  registerUser
} from "./service.js";

function handleAuthError(
  error: unknown,
  reply: FastifyReply
) {
  if (
    error instanceof Error &&
    error.message === "EMAIL_ALREADY_EXISTS"
  ) {
    return reply.status(409).send({
      code: "EMAIL_ALREADY_EXISTS",
      message: "An account with this email already exists"
    });
  }

  if (
    error instanceof Error &&
    error.message === "INVALID_CREDENTIALS"
  ) {
    return reply.status(401).send({
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password"
    });
  }

  throw error;
}

export async function registerAuthRoutes(
  app: FastifyInstance
): Promise<void> {
  app.post(
    "/auth/register",
    async (
      request: FastifyRequest,
      reply: FastifyReply
    ) => {
      try {
        const input =
          RegisterSchema.parse(request.body);

        const result =
          await registerUser(input);

        return reply.status(201).send(result);
      } catch (error) {
        return handleAuthError(
          error,
          reply
        );
      }
    }
  );

  app.post(
    "/auth/login",
    async (
      request: FastifyRequest,
      reply: FastifyReply
    ) => {
      try {
        const input =
          LoginSchema.parse(request.body);

        const result =
          await loginUser(input);

        return reply.send(result);
      } catch (error) {
        return handleAuthError(
          error,
          reply
        );
      }
    }
  );
}
