import { z } from 'zod'
import { Base } from './Base'
import { TileState } from '../game';

export const JoinGame = Base.extend({
  type: z.literal('joinGame'),
  payload: z.object({
    gameId: z.string()
  })
})
export type JoinGame = z.infer<typeof JoinGame>

export const JoinGameOutput = z.object({
  type: z.literal("joinGame"),
  payload: z.object({
    success: z.boolean(),
    gameId: z.number(),
    board: z.array(TileState),
    message: z.string().optional(),
  }),
});
export type JoinGameOutput = z.infer<typeof JoinGameOutput>