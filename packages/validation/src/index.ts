import { z } from "zod";

/*
 * Common
 */

export const IdSchema = z
  .string()
  .min(1)
  .max(128);

export const EmailSchema = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((value) => value.toLowerCase());

/*
 * Authentication
 */

export const RegisterSchema = z.object({
  email: EmailSchema,
  password: z
    .string()
    .min(8)
    .max(128),
  displayName: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .optional()
});

export const LoginSchema = z.object({
  email: EmailSchema,
  password: z
    .string()
    .min(1)
    .max(128)
});

export const RefreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1)
    .max(4096)
});

/*
 * Device
 */

export const PlatformSchema = z.enum([
  "android",
  "ios",
  "windows",
  "macos",
  "linux",
  "web"
]);

export const RegisterDeviceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(100),

  platform: PlatformSchema,

  appVersion: z
    .string()
    .max(50)
    .optional()
});

/*
 * VPN
 */

export const VPNProtocolSchema = z.enum([
  "wireguard",
  "openvpn",
  "ikev2"
]);

export const CreateVPNSessionSchema = z.object({
  deviceId: IdSchema,
  serverId: IdSchema,
  protocol: VPNProtocolSchema
});

export const VPNConfigRequestSchema = z.object({
  deviceId: IdSchema,
  serverId: IdSchema,
  protocol: VPNProtocolSchema
});

/*
 * Server
 */

export const ServerStatusSchema = z.enum([
  "online",
  "offline",
  "maintenance",
  "degraded"
]);

export const ServerQuerySchema = z.object({
  country: z
    .string()
    .trim()
    .max(100)
    .optional(),

  countryCode: z
    .string()
    .trim()
    .length(2)
    .optional(),

  city: z
    .string()
    .trim()
    .max(100)
    .optional(),

  protocol: VPNProtocolSchema.optional(),

  status: ServerStatusSchema.optional(),

  favoriteOnly: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),

  page: z
    .coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20)
});

/*
 * Favorites
 */

export const FavoriteServerSchema = z.object({
  serverId: IdSchema
});

/*
 * Support
 */

export const CreateSupportTicketSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(3)
    .max(200),

  message: z
    .string()
    .trim()
    .min(10)
    .max(5000)
});

/*
 * Admin
 */

export const AdminRoleSchema = z.enum([
  "SUPER_ADMIN",
  "ADMIN",
  "SUPPORT",
  "READ_ONLY"
]);

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterDeviceInput = z.infer<typeof RegisterDeviceSchema>;
export type CreateVPNSessionInput = z.infer<
  typeof CreateVPNSessionSchema
>;
export type VPNConfigRequestInput = z.infer<
  typeof VPNConfigRequestSchema
>;
export type ServerQueryInput = z.infer<typeof ServerQuerySchema>;
export type CreateSupportTicketInput = z.infer<
  typeof CreateSupportTicketSchema
>;
