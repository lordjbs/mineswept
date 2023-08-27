import { z } from "zod";
import { Connected, Ping } from "./BasicWebsocket";
import { CreateGame, CreateGameOutput } from "./CreateGame";
import { Error } from "./Error";
import { JoinGame, JoinGameOutput } from "./JoinGame";
import { MouseMove } from "./MouseMove";
import { TileClick, TileClickOutput } from "./TileClick";

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
