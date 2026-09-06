import type {
  WireGuardConfig
} from "./types.js";

export interface WireGuardClientConfig {
  privateKey: string;
  config: string;
}

function formatList(
  values: string[]
): string {
  return values.join(", ");
}

export function renderWireGuardConfig(
  config: WireGuardConfig,
  clientPrivateKey: string
): WireGuardClientConfig {
  const lines = [
    "[Interface]",
    `PrivateKey = ${clientPrivateKey}`,
    `Address = ${config.clientAddress}`,
    `DNS = ${formatList(config.dnsServers)}`
  ];

  if (config.mtu) {
    lines.push(
      `MTU = ${config.mtu}`
    );
  }

  lines.push(
    "",
    "[Peer]",
    `PublicKey = ${config.serverPublicKey}`,
    `Endpoint = ${config.endpoint}`,
    `AllowedIPs = ${formatList(config.allowedIPs)}`
  );

  if (config.keepaliveSeconds) {
    lines.push(
      `PersistentKeepalive = ${config.keepaliveSeconds}`
    );
  }

  return {
    privateKey: clientPrivateKey,
    config: `${lines.join("\n")}\n`
  };
}
