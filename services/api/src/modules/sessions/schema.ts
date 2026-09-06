import { z } from "zod";

export const SessionIdSchema = z.object({
  sessionId: z.string().min(1).max(128)
});

export const CreateSessionSchema = z.object({
  deviceId: z.string().min(1).max(128),
  serverId: z.string().min(1).max(128),
  protocol: z.enum([
    "wireguard",
    "openvpn",
    "ikev2"
  ])
});

export const SessionStatusSchema = z.enum([
  "connecting",
  "connected",
  "disconnecting",
  "disconnected",
  "reconnecting",
  "error"
]);

export type CreateSessionInput =
  z.infer<typeof CreateSessionSchema>;
