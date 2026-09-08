import type {
  VPNProtocol
} from "@nexavpn/types";

import {
  getServerVPNConfig
} from "./repository.js";

import {
  getOrCreateDeviceKey
} from "./key-service.js";

import type {
  VPNConfig
} from "./types.js";

export async function generateVPNConfig(
  params: {
    userId: string;
    deviceId: string;
    serverId: string;
    protocol: VPNProtocol;
  }
): Promise<VPNConfig> {
  const server =
    await getServerVPNConfig(
      params.serverId
    );

  if (!server) {
    throw new Error(
      "SERVER_NOT_FOUND"
    );
  }

  if (
    server.status !==
    "online"
  ) {
    throw new Error(
      "SERVER_UNAVAILABLE"
    );
  }

  if (
    !server.protocols.includes(
      params.protocol
    )
  ) {
    throw new Error(
      "PROTOCOL_NOT_SUPPORTED"
    );
  }

  const deviceKey =
    await getOrCreateDeviceKey(
      params.userId,
      params.deviceId
    );

  const common = {
    serverId:
      server.id,

    endpoint:
      `${server.hostname}:51820`,

    serverPublicKey:
      server.public_key,

    clientPublicKey:
      deviceKey.publicKey,

    dnsServers: [
      "1.1.1.1",
      "1.0.0.1"
    ],

    allowedIPs: [
      "0.0.0.0/0",
      "::/0"
    ]
  };

  if (
    params.protocol ===
    "wireguard"
  ) {
    return {
      ...common,
      protocol:
        "wireguard",
      clientAddress:
        "0.0.0.0/32",
      mtu: 1420,
      keepaliveSeconds: 25
    };
  }

  if (
    params.protocol ===
    "openvpn"
  ) {
    return {
      ...common,
      protocol:
        "openvpn",
      endpoint:
        `${server.hostname}:1194`,
      clientAddress:
        "0.0.0.0/32"
    };
  }

  return {
    ...common,
    protocol:
      "ikev2",
    endpoint:
      server.hostname,
    clientAddress:
      "0.0.0.0/32"
  };
}
