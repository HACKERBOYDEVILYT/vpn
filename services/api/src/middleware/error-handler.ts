import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";

export function registerErrorHandler(
  app: FastifyInstance
): void {
  app.setErrorHandler((error, request, reply) => {
    request.log.error(
      {
        err: error,
        requestId: request.id
      },
      "Request failed"
    );

    if (error instanceof ZodError) {
      return reply.status(400).send({
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        requestId: request.id,
        issues: error.issues
      });
    }

    const statusCode =
      typeof error.statusCode === "number" &&
      error.statusCode >= 400 &&
      error.statusCode < 600
        ? error.statusCode
        : 500;

    return reply.status(statusCode).send({
      code:
        statusCode >= 500
          ? "INTERNAL_SERVER_ERROR"
          : "REQUEST_ERROR",
      message:
        statusCode >= 500
          ? "An unexpected error occurred"
          : error.message,
      requestId: request.id
    });
  });
}
