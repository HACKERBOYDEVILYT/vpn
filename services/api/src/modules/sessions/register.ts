import type {
  FastifyInstance
} from "fastify";

import {
  registerSessionRoutes
} from "./routes.js";

import {
  registerConnectRoute
} from "./connect-route.js";

import {
  registerDisconnectRoute
} from "./disconnect-route.js";

import {
  registerSessionStateRoute
} from "./state-route.js";

export async function registerSessionModule(
  app: FastifyInstance
) {
  await registerSessionRoutes(
    app
  );

  await registerConnectRoute(
    app
  );

  await registerDisconnectRoute(
    app
  );

  await registerSessionStateRoute(
    app
  );
}
