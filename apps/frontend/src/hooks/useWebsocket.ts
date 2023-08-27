import { create } from 'zustand'
import { ws } from '../utils/websocket';
import { TileState } from '../utils/tile';

interface WebsocketState {
  gameId: string;
  board: TileState[];
  createGame(): void;
  joinGame(id: string): void;
  tileClick(id: number): void,
}

const useWebhook = create<WebsocketState>()((set) => ({
  gameId: '',
  board: [],
  createGame: () => {
    ws.send(JSON.stringify({ type: "createGame" }))
  },
  joinGame: (id: string) => {
    ws.send(JSON.stringify({ type: "joinGame", id }))
  },
  tileClick: (id) => {
    set((state) => {
      const newBoard = [...state.board];
      newBoard[id] = { clicked: true };
      return {
        board: newBoard,
      };
    })
    ws.send(JSON.stringify({ type: "tileClick", num: id }))
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