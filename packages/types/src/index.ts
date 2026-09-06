export type Platform =
  | "android"
  | "ios"
  | "windows"
  | "macos"
  | "linux"
  | "web";

export type VPNProtocol =
  | "wireguard"
  | "openvpn"
  | "ikev2";

export type ServerStatus =
  | "online"
  | "offline"
  | "maintenance"
  | "degraded";

export type VPNConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "disconnecting"
  | "reconnecting"
  | "error";

export type SubscriptionPlan =
  | "free"
  | "premium";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "expired"
  | "cancelled"
  | "past_due";

export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  id: string;
  userId: string;
  name: string;
  platform: Platform;
  appVersion?: string;
  lastSeenAt?: string;
  createdAt: string;
}

export interface VPNServer {
  id: string;
  country: string;
  countryCode: string;
  city: string;
  hostname: string;
  publicKey: string;
  protocols: VPNProtocol[];
  status: ServerStatus;
  latencyMs?: number;
  loadPercent?: number;
  capacity?: number;
  region: string;
}

export interface ServerHealth {
  serverId: string;
  latencyMs: number;
  packetLossPercent?: number;
  loadPercent: number;
  status: ServerStatus;
  checkedAt: string;
}

export interface VPNSession {
  id: string;
  userId: string;
  deviceId: string;
  serverId: string;
  protocol: VPNProtocol;
  state: VPNConnectionState;
  startedAt?: string;
  endedAt?: string;
  durationSeconds?: number;
}

export interface VPNConfiguration {
  serverId: string;
  protocol: VPNProtocol;
  endpoint: string;
  serverPublicKey: string;
  clientAddress: string;
  dnsServers: string[];
  allowedIPs: string[];
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startedAt: string;
  expiresAt?: string;
  autoRenew: boolean;
}

export interface FavoriteServer {
  userId: string;
  serverId: string;
  createdAt: string;
}

export interface SpeedTestResult {
  pingMs: number;
  downloadMbps: number;
  uploadMbps: number;
  jitterMs?: number;
  testedAt: string;
}

export interface IPInformation {
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  isp?: string;
  asn?: string;
  ipv6?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  status: "open" | "pending" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  code: string;
  message: string;
  requestId?: string;
}
