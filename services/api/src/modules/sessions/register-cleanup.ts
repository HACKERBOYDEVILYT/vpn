import type { FastifyInstance } from "fastify";
import {
  startSessionCleanupRunner,
  stopSessionCleanupRunner
} from "./session-cleanup-runner.js";

export async function registerSessionCleanup(
  app: FastifyInstance
) {
  startSessionCleanupRunner();

  app.addHook("onClose", async () => {
    stopSessionCleanupRunner();
  });
}
