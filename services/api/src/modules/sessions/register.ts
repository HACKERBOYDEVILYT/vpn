import type {
  FastifyInstance
} from "fastify";

import {
  registerSessionRoutes
} from "./routes.js";

import {
  registerDisconnectRoute
} from "./disconnect-route.js";

export async function registerSessionModule(
  app: FastifyInstance
) {
  await registerSessionRoutes(
    app
  );

  await registerDisconnectRoute(
    app
  );
}
