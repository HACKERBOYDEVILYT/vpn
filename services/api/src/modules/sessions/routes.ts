import type { FastifyInstance } from "fastify";

import { requireAuth } from "../auth/guard.js";

import {
  CreateSessionSchema,
  SessionIdSchema
} from "./schema.js";

import {
  startVPNSession,
  getVPNSession,
  changeVPNSessionState,
  getActiveVPNSessions
} from "./service.js";

export async function registerSessionRoutes(
  app: FastifyInstance
): Promise<void> {
  app.get(
    "/sessions/active",
    {
      preHandler: requireAuth
    },
    async (request) => {
      const sessions =
        await getActiveVPNSessions(
          request.auth.user.id
        );

      return {
        sessions
      };
    }
  );

  app.post(
    "/sessions",
    {
      preHandler: requireAuth
    },
    async (request, reply) => {
      const input =
        CreateSessionSchema.parse(
          request.body
        );

      try {
        const session =
          await startVPNSession(
            request.auth.user.id,
            input
          );

        return reply
          .status(201)
          .send({
            session
          });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message ===
            "DEVICE_NOT_FOUND"
        ) {
          return reply
            .status(404)
            .send({
              code:
                "DEVICE_NOT_FOUND",
              message:
                "Device not found",
              requestId:
                request.id
            });
        }

        if (
          error instanceof Error &&
          error.message ===
            "SERVER_NOT_FOUND"
        ) {
          return reply
            .status(404)
            .send({
              code:
                "SERVER_NOT_FOUND",
              message:
                "VPN server not found",
              requestId:
                request.id
            });
        }

        if (
          error instanceof Error &&
          error.message ===
            "SERVER_UNAVAILABLE"
        ) {
          return reply
            .status(409)
            .send({
              code:
                "SERVER_UNAVAILABLE",
              message:
                "VPN server is currently unavailable",
              requestId:
                request.id
            });
        }

        if (
          error instanceof Error &&
          error.message ===
            "PROTOCOL_NOT_SUPPORTED"
        ) {
          return reply
            .status(400)
            .send({
              code:
                "PROTOCOL_NOT_SUPPORTED",
              message:
                "Selected VPN protocol is not supported by this server",
              requestId:
                request.id
            });
        }

        throw error;
      }
    }
  );

  app.get(
    "/sessions/:sessionId",
    {
      preHandler: requireAuth
    },
    async (request, reply) => {
      const params =
        SessionIdSchema.parse(
          request.params
        );

      const session =
        await getVPNSession(
          request.auth.user.id,
          params.sessionId
        );

      if (!session) {
        return reply
          .status(404)
          .send({
            code:
              "SESSION_NOT_FOUND",
            message:
              "VPN session not found",
            requestId:
              request.id
          });
      }

      return {
        session
      };
    }
  );

  app.post(
    "/sessions/:sessionId/connect",
    {
      preHandler: requireAuth
    },
    async (request, reply) => {
      const params =
        SessionIdSchema.parse(
          request.params
        );

      try {
        const session =
          await changeVPNSessionState(
            request.auth.user.id,
            params.sessionId,
            "connected"
          );

        return {
          session
        };
      } catch (error) {
        if (
          error instanceof Error &&
          error.message ===
            "SESSION_NOT_FOUND"
        ) {
          return reply
            .status(404)
            .send({
              code:
                "SESSION_NOT_FOUND",
              message:
                "VPN session not found",
              requestId:
                request.id
            });
        }

        throw error;
      }
    }
  );

  app.post(
    "/sessions/:sessionId/disconnect",
    {
      preHandler: requireAuth
    },
    async (request, reply) => {
      const params =
        SessionIdSchema.parse(
          request.params
        );

      try {
        const session =
          await changeVPNSessionState(
            request.auth.user.id,
            params.sessionId,
            "disconnected"
          );

        return {
          session
        };
      } catch (error) {
        if (
          error instanceof Error &&
          error.message ===
            "SESSION_NOT_FOUND"
        ) {
          return reply
            .status(404)
            .send({
              code:
                "SESSION_NOT_FOUND",
              message:
                "VPN session not found",
              requestId:
                request.id
            });
        }

        throw error;
      }
    }
  );
}
