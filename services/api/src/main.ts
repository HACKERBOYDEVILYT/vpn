import { createApp } from "./app.js";

async function start() {
  const app = await createApp();

  try {
    const port = Number(process.env.API_PORT ?? 4000);
    const host = process.env.API_HOST ?? "0.0.0.0";

    await app.listen({
      port,
      host
    });

    app.log.info(
      `NexaVPN API running on ${host}:${port}`
    );
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void start();
