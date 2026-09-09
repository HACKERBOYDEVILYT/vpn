import type { FastifyInstance } from "fastify";
import { registerSessionRoutes } from "./routes.js";
import { registerConnectRoute } from "./connect-route.js";
import { registerDisconnectRoute } from "./disconnect-route.js";
import { registerSessionStateRoute } from "./state-route.js";
import { registerFailureRoute } from "./failure-route.js";
import { registerSessionStatusRoute } from "./status-route.js";
import { registerReconnectRoute } from "./reconnect-route.js";
import { registerReconnectCompleteRoute } from "./reconnect-complete-route.js";
import { registerReconnectFailureRoute } from "./reconnect-failure-route.js";
import { registerSessionHeartbeatRoute } from "./heartbeat-route.js";

export async function registerSessionModule(
  app: FastifyInstance
) {
  await registerSessionRoutes(app);
  await registerConnectRoute(app);
  await registerDisconnectRoute(app);
  await registerSessionStateRoute(app);
  await registerFailureRoute(app);
  await registerSessionStatusRoute(app);
  await registerReconnectRoute(app);
  await registerReconnectCompleteRoute(app);
  await registerReconnectFailureRoute(app);
  await registerSessionHeartbeatRoute(app);
}
