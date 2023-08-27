import { z } from "zod";

export const CreateGame = z.object({
    type: z.literal('createGame'),
});
export type CreateGame = z.infer<typeof CreateGame>;

export const CreateGameOutput = z.object({
    type: z.literal('createGame'),
    payload: z.object({
        success: z.boolean(),
        id: z.number(),
    })
});
export type CreateGameOutput = z.infer<typeof CreateGameOutput>;