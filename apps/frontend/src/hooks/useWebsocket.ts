import { create } from 'zustand'
import { ws } from '../utils/websocket';
import { TileState } from '../utils/tile';

interface WebsocketState {
  gameId: string;
  board: TileState[];
  createGame(): void;
  joinGame(id: string): void;
  tileClick(id: number, action: "click" | "flag"): void;
}

const useWebhook = create<WebsocketState>()((set) => ({
  gameId: "",
  board: [],
  createGame: () => {
    ws.send(JSON.stringify({ type: "createGame" }));
  },
  joinGame: (id: string) => {
    ws.send(JSON.stringify({ type: "joinGame", id }));
  },
  tileClick: (id, action) => {
    set((state) => {
      const newBoard = [...state.board];
      if (action === "flag") {
        newBoard[id] = { ...newBoard[id], flagged: true };
      } else {
        newBoard[id] = { ...newBoard[id], clicked: true };
      }
      return {
        board: newBoard,
      };
    });
    ws.send(JSON.stringify({ type: "tileClick", num: id, action: action }));
  },
  // joinGame: (gameId: string) => {
  //   // TODO - Validate gameId
  //   set({ gameId });
  // },
  // leaveGame: () => {
  //   // TODO - Tell server we left.
  //   set({ gameId: "" });
  // }
}));

export default useWebhook