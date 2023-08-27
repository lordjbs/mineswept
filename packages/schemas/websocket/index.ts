import { z } from 'zod';
import { CreateGame, CreateGameOutput } from "./CreateGame";
import { JoinGame, JoinGameOutput } from './JoinGame';
import { TileClick, TileClickOutput } from './TileClick';
import { Error } from './Error';
import { MouseMove } from './MouseMove';
import { Connected, Ping } from './BasicWebsocket';

export const VALID_INPUTS = z.discriminatedUnion("type", [
  CreateGame,
  JoinGame,
  TileClick,
  MouseMove,
  
]);
export type VALID_INPUTS = z.infer<typeof VALID_INPUTS>;

export const VALID_OUTPUTS = z.discriminatedUnion("type", [
  Error,
  CreateGameOutput,
  JoinGameOutput,
  TileClickOutput,
  MouseMove,
  Connected,
  Ping,
]);
export type VALID_OUTPUTS = z.infer<typeof VALID_OUTPUTS>;

export * from "./CreateGame";
export * from "./JoinGame";
export * from "./TileClick";