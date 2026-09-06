import { createApp } from "./app.js";

import {
  checkDatabaseConnection,
  closeDatabase
} from "./database/index.js";

async function start() {
  const app = await createApp();

  try {
    await checkDatabaseConnection();

    app.log.info(
      "PostgreSQL connection established"
    );

    const port = Number(
      process.env.API_PORT ?? 4000
    );

    const host =
      process.env.API_HOST ?? "0.0.0.0";

    await app.listen({
      port,
      host
    });

    app.log.info(
      `NexaVPN API running on ${host}:${port}`
    );

    const shutdown = async (
      signal: string
    ) => {
      app.log.info(
        `${signal} received, shutting down`
      );

      await app.close();
      await closeDatabase();

      process.exit(0);
    };

    process.once("SIGINT", () => {
      void shutdown("SIGINT");
    });

    process.once("SIGTERM", () => {
      void shutdown("SIGTERM");
    });
  } catch (error) {
    app.log.error(error);

    await app.close().catch(() => undefined);
    await closeDatabase().catch(() => undefined);

    process.exit(1);
  }
}

void start();
