export {
  generateVPNConfig
} from "./service.js";

export {
  getServerVPNConfig
} from "./repository.js";

export {
  generateClientKeyPair,
  generateClientId
} from "./crypto.js";

export {
  getOrCreateDeviceKey
} from "./key-service.js";

export {
  findDeviceKey,
  createDeviceKey
} from "./key-repository.js";

export type {
  DeviceKeyRecord
} from "./key-repository.js";

export type {
  VPNConfig,
  WireGuardConfig
} from "./types.js";

export {
  VPNConfigRequestSchema,
  type VPNConfigRequest
} from "./schema.js";

export {
  registerVPNConfigRoutes
} from "./routes.js";

export {
  registerVPNKeyRoutes
} from "./key-routes.js";
