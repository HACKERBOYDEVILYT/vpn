import { z } from "zod";

export const ServerIdSchema = z.object({
  serverId: z.string().min(1).max(128)
});

export const ServerQuerySchema = z.object({
  country: z.string().trim().max(100).optional(),

  countryCode: z
    .string()
    .trim()
    .length(2)
    .optional(),

  city: z.string().trim().max(100).optional(),

  protocol: z
    .enum([
      "wireguard",
      "openvpn",
      "ikev2"
    ])
    .optional(),

  status: z
    .enum([
      "online",
      "offline",
      "maintenance",
      "degraded"
    ])
    .optional(),

  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20)
});

export type ServerQueryInput =
  z.infer<typeof ServerQuerySchema>;
