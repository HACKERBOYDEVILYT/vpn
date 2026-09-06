import { z } from "zod";

export const UpdateUserProfileSchema =
  z.object({
    displayName: z
      .string()
      .trim()
      .min(1)
      .max(80)
      .optional(),

    avatarUrl: z
      .string()
      .url()
      .max(2048)
      .optional()
  })
  .refine(
    (value) =>
      value.displayName !== undefined ||
      value.avatarUrl !== undefined,
    {
      message:
        "At least one profile field is required"
    }
  );

export type UpdateUserProfileInput =
  z.infer<
    typeof UpdateUserProfileSchema
  >;
