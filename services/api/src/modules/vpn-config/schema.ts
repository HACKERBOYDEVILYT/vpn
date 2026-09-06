import { z } from "zod";

export const VPNConfigRequestSchema = z.object({
  deviceId: z.string().min(1).max(128),
  serverId: z.string().min(1).max(128),
  protocol: z.enum([
    "wireguard",
    "openvpn",
    "ikev2"
  ])
});

export type VPNConfigRequest =
  z.infer<
    typeof VPNConfigRequestSchema
  >;
