import { randomUUID } from "node:crypto";
import type { FastifyRequest } from "fastify";

export interface RequestContext {
  requestId: string;
  startedAt: number;
}

declare module "fastify" {
  interface FastifyRequest {
    context: RequestContext;
  }
}

export function attachRequestContext(
  request: FastifyRequest
): void {
  request.context = {
    requestId:
      request.headers["x-request-id"]?.toString() ??
      randomUUID(),
    startedAt: Date.now()
  };
}
