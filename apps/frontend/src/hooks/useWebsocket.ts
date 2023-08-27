import { create } from 'zustand'
import { ws } from '../utils/websocket';
import { TileState } from '../utils/tile';
import { CreateGame, JoinGame, TileClickAction, VALID_INPUTS } from 'schemas';

interface WebsocketState {
  gameId: null | number;
  board: TileState[];
  createGame(payload: CreateGame): void;
  joinGame(id: string): void;
  tileClick(tileId: number, gameId: number, action: TileClickAction): void;
}

const send = (ws: WebSocket, payload: VALID_INPUTS) => {
  return ws.send(JSON.stringify(payload));
}

const useWebhook = create<WebsocketState>()((set) => ({
  gameId: null,
  board: [],
  createGame: () => {
    const payload: CreateGame = {
      type: "createGame"
    }
    send(ws, payload);
  },
  joinGame: (id: string) => {
    const payload: JoinGame = {
      type: "joinGame",
      payload: {
        gameId: id
      }
    }
    send(ws, payload)
  },
  tileClick: (tileId, gameId, action) => {
    set((state) => {
      const newBoard = [...state.board];
      if (action === "flag") {
        newBoard[tileId] = { ...newBoard[tileId], flagged: true };
      } else {
        newBoard[tileId] = { ...newBoard[tileId], clicked: true };
      }
      return {
        board: newBoard,
      };
    });
    send(ws, { type: "tileClick", payload: {
      tileId,
      gameId,
      action
    } });
  },
}));

export default useWebhook