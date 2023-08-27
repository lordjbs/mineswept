import { z } from "zod";
import { TileState } from "../game";

export const CreateGame = z.object({
  type: z.literal("createGame"),
});
export type CreateGame = z.infer<typeof CreateGame>;

export const CreateGameOutput = z.object({
  type: z.literal("createGame"),
  payload: z.object({
    success: z.boolean(),
    gameId: z.number(),
    board: z.array(TileState),
  }),
});
export type CreateGameOutput = z.infer<typeof CreateGameOutput>;
