import useWebhook from "../hooks/useWebsocket";
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
          gameId: parsedData.payload.gameId,
          board: parsedData.payload.board,
        });
        break;
      case "tileClick":
        console.info(WEBSOCKET_LOGGER_PREFIX, "tileClick", parsedData);
        useWebhook.setState(() => ({ board: parsedData.payload.board }));
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
            gameId: parsedData.payload.gameId,
            board: parsedData.payload.board,
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