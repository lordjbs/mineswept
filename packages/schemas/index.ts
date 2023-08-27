import { z } from 'zod';
import { CreateGame, CreateGameOutput } from "./CreateGame";
import { JoinGame, JoinGameOutput } from './JoinGame';
import { TileClick, TileClickOutput } from './TileClick';
import { Error } from './Error'

export const VALID_INPUTS = z.discriminatedUnion("type", [
  CreateGame,
  JoinGame,
  TileClick,
]);
export type VALID_INPUTS = z.infer<typeof VALID_INPUTS>;

export const VALID_OUTPUTS = z.discriminatedUnion("type", [
  Error,
  CreateGameOutput,
  JoinGameOutput,
  TileClickOutput,
]);
export type VALID_OUTPUTS = z.infer<typeof VALID_OUTPUTS>;

export * from "./CreateGame";
export * from "./JoinGame";
export * from "./TileClick";