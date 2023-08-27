import { create } from 'zustand'

const ws = new WebSocket("ws://localhost:3001");

ws.onopen = () => {
  console.log('web socket :)!')
}

ws.onclose = () => {
  console.log('web socket :(!')
}

interface WebsocketState {
  gameId: string,
  send(): void,
}

const useWebhook = create<WebsocketState>()((set) => ({
  gameId: '',
  joinGame: (gameId: string) => {
    // TODO - Validate gameId
    set({ gameId });
  },
  leaveGame: () => {
    // TODO - Tell server we left.
    set({ gameId: "" });
  },
  send: () => {
    ws.send(JSON.stringify({ gameId: "1234", message: "Hello" }))
  }
}));

export default useWebhook