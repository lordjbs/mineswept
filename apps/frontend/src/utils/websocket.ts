import { range } from "lodash";
import useWebhook from "../hooks/useWebsocket";
import { COLUMN_SIZE, ROW_SIZE } from "./tile";

const ws = new WebSocket("ws://localhost:3001");

const WEBSOCKET_LOGGER_PREFIX = "[websocket]";

ws.onopen = () => {
  console.info(WEBSOCKET_LOGGER_PREFIX, "connected");
};

ws.onclose = () => {
  console.info(WEBSOCKET_LOGGER_PREFIX, "disconnected");
};

ws.addEventListener("message", ({ data }) => {
  
  const parsedData = JSON.parse(data);

  switch(parsedData.type) {
    case "createGame":
      console.info(WEBSOCKET_LOGGER_PREFIX, "createGame", parsedData);
      useWebhook.setState({ 
        gameId: parsedData.id,
        board: range(0, COLUMN_SIZE * ROW_SIZE).map(() => ({ clicked: false })),
      });
      break;
    case "tileClick":
      console.info(WEBSOCKET_LOGGER_PREFIX, "tileClick", parsedData);
      useWebhook.setState((state) => {
        const board = [...state.board];
        board[parsedData.num] = { clicked: true };
        return { board };
      });
      break;
    case "joinGame":
      console.info(WEBSOCKET_LOGGER_PREFIX, "joinGame", parsedData);
      if ( parsedData.success === false ) {
        console.error(WEBSOCKET_LOGGER_PREFIX, "joinGame", parsedData.message);
        return;
      } else {
        console.info(WEBSOCKET_LOGGER_PREFIX, "joinGame", parsedData)
        useWebhook.setState({ 
          gameId: parsedData.id,
          board: range(0, COLUMN_SIZE * ROW_SIZE).map(() => ({ clicked: false })),
        });
      }
      break;
    default:
      console.log(WEBSOCKET_LOGGER_PREFIX, "unknown message", parsedData)
  }
});

export { ws }