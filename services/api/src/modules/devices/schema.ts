import { z } from "zod";

export const DeviceIdSchema = z.object({
  deviceId: z
    .string()
    .min(1)
    .max(128)
});

export const RegisterDeviceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(100),

  platform: z.enum([
    "android",
    "ios",
    "windows",
    "macos",
    "linux",
    "web"
  ]),

  appVersion: z
    .string()
    .trim()
    .max(50)
    .optional()
});

export type RegisterDeviceInput =
  z.infer<typeof RegisterDeviceSchema>;
