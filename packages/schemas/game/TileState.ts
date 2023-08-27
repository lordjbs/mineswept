import { z } from "zod";

export const TileState = z.object({
  clicked: z.boolean(),
  bomb: z.boolean(),
  flagged: z.boolean(),
  nearby: z.number(),
});
export type TileState = z.infer<typeof TileState>;
