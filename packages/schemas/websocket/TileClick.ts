import { z } from "zod";
import { TileState } from "..";
import { Base } from "./Base";

export const TileClickAction = z.enum(["click", "flag"]);
export type TileClickAction = z.infer<typeof TileClickAction>;

export const TileClick = Base.extend({
  type: z.literal("tileClick"),
  payload: z.object({
    gameId: z.number(),
    tileId: z.number(),
    action: TileClickAction,
  }),
});
export type TileClick = z.infer<typeof TileClick>;

export const TileClickOutput = z.object({
  type: z.literal("tileClick"),
  payload: z.object({
    board: z.array(TileState),
  }),
});
export type TileClickOutput = z.infer<typeof TileClickOutput>;
