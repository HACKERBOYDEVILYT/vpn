import type {
  VPNProtocol
} from "@nexavpn/types";

export interface VPNConfig {
  serverId: string;

  protocol: VPNProtocol;

  endpoint: string;

  serverPublicKey: string;

  clientAddress: string;

  dnsServers: string[];

  allowedIPs: string[];

  mtu?: number;

  keepaliveSeconds?: number;
}

export interface WireGuardConfig
  extends VPNConfig {
  protocol: "wireguard";

  privateKey: string;

  publicKey: string;
}
