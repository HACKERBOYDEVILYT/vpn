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
} from "./key-crypto.js";

import {
  renderWireGuardConfig
} from "./wireguard.js";

import {
  allocateClientAddress
} from "./address-service.js";

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

  const clientAddress =
    await allocateClientAddress({
      userId:
        params.userId,
      deviceId:
        params.deviceId,
      serverId:
        params.serverId,
      protocol:
        params.protocol
    });

  const resolvedConfig = {
    ...config,
    clientAddress
  };

  if (
    config.protocol !==
    "wireguard"
  ) {
    return {
      config: resolvedConfig,
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
      {
        ...config,
        clientAddress
      },
      privateKey
    );

  return {
    config: resolvedConfig,
    client: {
      protocol: "wireguard",
      config:
        rendered.config
    }
  };
}
