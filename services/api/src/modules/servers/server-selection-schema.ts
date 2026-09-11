import { z } from "zod";

export const ServerSelectionQuerySchema = z.object({
  region: z.string().min(2).max(32).optional(),
  city: z.string().min(1).max(64).optional(),
  mode: z
    .enum([
      "best",
      "lowest_latency",
      "lowest_load"
    ])
    .default("best")
});

export type ServerSelectionQuery = z.infer<
  typeof ServerSelectionQuerySchema
>;
