import { z } from 'zod'

export const Error = z.object({
  type: z.literal("error"),
  payload: z.object({
    message: z.string(),
  }),
});
export type Error = z.infer<typeof Error>