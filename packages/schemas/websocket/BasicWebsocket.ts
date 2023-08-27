import { z } from 'zod'

export const Connected = z.object({
  type: z.literal("connected"),
});
export type Connected = z.infer<typeof Connected>

export const Ping = z.object({
  type: z.literal("ping")
});
export type Ping = z.infer<typeof Ping>
