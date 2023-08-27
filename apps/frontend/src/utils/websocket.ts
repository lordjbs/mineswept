import { range } from "lodash";
import useWebhook from "../hooks/useWebsocket";
import { DefaultTile, COLUMN_SIZE, ROW_SIZE } from "./tile";
import { VALID_OUTPUTS } from "schemas";

const ws = new WebSocket("ws://localhost:3001");

const WEBSOCKET_LOGGER_PREFIX = "[websocket]";

ws.onopen = () => {
  console.info(WEBSOCKET_LOGGER_PREFIX, "connected");
};

ws.onclose = () => {
  console.info(WEBSOCKET_LOGGER_PREFIX, "disconnected");
};

ws.addEventListener("message", ({ data }) => {
  try { 
    const parsedData = VALID_OUTPUTS.parse(JSON.parse(data));

    switch (parsedData.type) {
      case "createGame":
        console.info(WEBSOCKET_LOGGER_PREFIX, "createGame", parsedData);
        useWebhook.setState({
          gameId: parsedData.payload.id,
          board: range(0, COLUMN_SIZE * ROW_SIZE).map(() => DefaultTile),
        });
        break;
      case "tileClick":
        console.info(WEBSOCKET_LOGGER_PREFIX, "tileClick", parsedData);
        useWebhook.setState((state) => {
          const board = [...state.board];
          if (parsedData.payload.action === "flag") {
            board[parsedData.payload.tileId] = {
              ...board[parsedData.payload.tileId],
              flagged: true,
            };
          } else {
            board[parsedData.payload.tileId] = {
              ...board[parsedData.payload.tileId],
              clicked: true,
            };
          }
          return { board };
        });
        break;
      case "joinGame":
        console.info(WEBSOCKET_LOGGER_PREFIX, "joinGame", parsedData);
        if (parsedData.payload.success === false) {
          console.error(
            WEBSOCKET_LOGGER_PREFIX,
            "joinGame",
            parsedData.payload.message
          );
          return;
        } else {
          console.info(WEBSOCKET_LOGGER_PREFIX, "joinGame", parsedData);
          useWebhook.setState({
            gameId: parsedData.payload.id,
            board: range(0, COLUMN_SIZE * ROW_SIZE).map(() => DefaultTile),
          });
        }
        break;
      case "error":
        console.error(WEBSOCKET_LOGGER_PREFIX, "error", parsedData);
        break;
    }
  } catch(e) {
    console.error(WEBSOCKET_LOGGER_PREFIX, "error", e);
  }
});

export { ws }