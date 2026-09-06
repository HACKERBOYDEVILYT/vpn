import type {
  VPNProtocol
} from "@nexavpn/types";

import {
  getServerVPNConfig
} from "./repository.js";

import type {
  VPNConfig
} from "./types.js";

export async function generateVPNConfig(
  params: {
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
    server.status !== "online"
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

  if (
    params.protocol ===
    "wireguard"
  ) {
    return {
      serverId: server.id,
      protocol: "wireguard",
      endpoint:
        `${server.hostname}:51820`,
      serverPublicKey:
        server.public_key,
      clientAddress:
        "10.0.0.2/32",
      dnsServers: [
        "1.1.1.1",
        "1.0.0.1"
      ],
      allowedIPs: [
        "0.0.0.0/0",
        "::/0"
      ],
      mtu: 1420,
      keepaliveSeconds: 25
    };
  }

  if (
    params.protocol ===
    "openvpn"
  ) {
    return {
      serverId: server.id,
      protocol: "openvpn",
      endpoint:
        `${server.hostname}:1194`,
      serverPublicKey:
        server.public_key,
      clientAddress:
        "10.8.0.2/32",
      dnsServers: [
        "1.1.1.1",
        "1.0.0.1"
      ],
      allowedIPs: [
        "0.0.0.0/0",
        "::/0"
      ]
    };
  }

  return {
    serverId: server.id,
    protocol: "ikev2",
    endpoint:
      server.hostname,
    serverPublicKey:
      server.public_key,
    clientAddress:
      "10.20.0.2/32",
    dnsServers: [
      "1.1.1.1",
      "1.0.0.1"
    ],
    allowedIPs: [
      "0.0.0.0/0",
      "::/0"
    ]
  };
}
