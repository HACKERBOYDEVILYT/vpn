import type {
  VPNProtocol
} from "@nexavpn/types";

import {
  generateVPNConfig
} from "./service.js";

import {
  findDeviceKey
} from "./key-repository.js";

import {
  decryptPrivateKey
} from "./key-service.js";

import {
  renderWireGuardConfig
} from "./wireguard.js";

export async function generateClientVPNConfig(
  params: {
    userId: string;
    deviceId: string;
    serverId: string;
    protocol: VPNProtocol;
  }
) {
  const config =
    await generateVPNConfig(params);

  if (
    config.protocol !==
    "wireguard"
  ) {
    return {
      config,
      client: null
    };
  }

  const deviceKey =
    await findDeviceKey(
      params.userId,
      params.deviceId
    );

  if (!deviceKey) {
    throw new Error(
      "DEVICE_KEY_NOT_FOUND"
    );
  }

  const privateKey =
    decryptPrivateKey(
      deviceKey.privateKeyEncrypted
    );

  const rendered =
    renderWireGuardConfig(
      config,
      privateKey
    );

  return {
    config,
    client: {
      protocol: "wireguard",
      config: rendered.config
    }
  };
}
