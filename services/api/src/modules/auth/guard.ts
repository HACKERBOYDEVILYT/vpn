import type {
  FastifyReply,
  FastifyRequest
} from "fastify";

import {
  verifyAccessToken
} from "./token.js";

import {
  findUserById
} from "./repository.js";

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const authorization =
    request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    await reply.status(401).send({
      code: "UNAUTHORIZED",
      message: "Authentication required",
      requestId: request.id
    });

    return;
  }

  const token =
    authorization.slice("Bearer ".length).trim();

  const payload =
    verifyAccessToken(token);

  if (!payload) {
    await reply.status(401).send({
      code: "INVALID_ACCESS_TOKEN",
      message: "Invalid or expired access token",
      requestId: request.id
    });

    return;
  }

  const user =
    await findUserById(payload.userId);

  if (!user) {
    await reply.status(401).send({
      code: "USER_NOT_FOUND",
      message: "Authenticated user no longer exists",
      requestId: request.id
    });

    return;
  }

  request.auth = {
    user,
    sessionId: payload.sessionId
  };
}

declare module "fastify" {
  interface FastifyRequest {
    auth: {
      user: Awaited<
        ReturnType<typeof findUserById>
      > extends infer T
        ? Exclude<T, null>
        : never;
      sessionId: string;
    };
  }
}
