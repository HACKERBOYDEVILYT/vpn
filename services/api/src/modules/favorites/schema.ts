import { z } from "zod";

export const FavoriteServerSchema = z.object({
  serverId: z
    .string()
    .min(1)
    .max(128)
});

export type FavoriteServerInput =
  z.infer<typeof FavoriteServerSchema>;
