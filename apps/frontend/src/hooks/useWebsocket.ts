import { CreateGame, TileClickAction, TileState, VALID_INPUTS } from "schemas";
import { create } from "zustand";
import { ws } from "../utils/websocket";

interface WebsocketState {
  gameId: null | number;
  board: TileState[];
  createGame(payload: CreateGame): void;
  joinGame(id: string): void;
  tileClick(tileId: number, gameId: number, action: TileClickAction): void;
}

const send = (ws: WebSocket, payload: VALID_INPUTS) => {
  return ws.send(JSON.stringify(payload));
};

const useWebhook = create<WebsocketState>()(() => ({
  gameId: null,
  board: [],
  createGame: () => {
    send(ws, {
      type: "createGame",
    });
  },
  joinGame: (id: string) => {
    send(ws, {
      type: "joinGame",
      payload: {
        gameId: id,
      },
    });
  },
  tileClick: (tileId, gameId, action) => {
    send(ws, {
      type: "tileClick",
      payload: {
        tileId,
        gameId,
        action,
      },
    });
  },
}));

export default useWebhook;
