import type {
  FastifyInstance
} from "fastify";

import {
  registerVPNConfigRoutes
} from "./routes.js";

import {
  registerVPNKeyRoutes
} from "./key-routes.js";

import {
  registerVPNClientConfigRoutes
} from "./config-routes.js";

import {
  registerVPNAddressRoutes
} from "./address-routes.js";

export async function registerVPNConfigModule(
  app: FastifyInstance
) {
  await registerVPNConfigRoutes(
    app
  );

  await registerVPNKeyRoutes(
    app
  );

  await registerVPNClientConfigRoutes(
    app
  );

  await registerVPNAddressRoutes(
    app
  );
}
