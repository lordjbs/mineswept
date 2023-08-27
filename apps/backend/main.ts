import { WebSocketServer, type WebSocket, MessageEvent } from "ws";
import { TileState, VALID_INPUTS, VALID_OUTPUTS } from 'schemas'
import { range } from "lodash";

const wss = new WebSocketServer({
  port: parseInt(process.env.WEBSOCKET_SERVER_PORT ?? "3001"),
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    clientNoContextTakeover: true,
    serverNoContextTakeover: true,
    serverMaxWindowBits: 10,
    concurrencyLimit: 10,
    threshold: 1024,
  },
  maxPayload: 2097152,
});

const connections: WebSocket[] = [];
const games: {
  [key: string]: {
    gameId: number;
    host: WebSocket;
    connections: WebSocket[];
    board: TileState[];
  };
} = {};

wss.on('connection', (conn) => {
    connections.push(conn);

    conn.on("message", (message: MessageEvent) => {
        // TODO - We should really enforce these types. Lol.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        try {
          const data = VALID_INPUTS.parse(JSON.parse(message.toString()));
          switch (data.type) {
            case "createGame":
              const gameId = Math.floor(Math.random() * 90000) + 10000;
              games[gameId] = {
                gameId: gameId,
                host: conn,
                connections: [conn],
                board: range(0, 64).map(() => ({
                  clicked: false,
                  bomb: false,
                  flagged: false,
                  nearby: 0,
                })),
              };

              send(conn, {
                type: "createGame",
                payload: {
                  success: true,
                  id: gameId,
                },
              });
              break;
            case "joinGame":
              // TODO - Should really check if the game exists.
              // eslint-disable-next-line no-prototype-builtins
              if (!games.hasOwnProperty(data.payload.gameId))
                return send(conn, {
                  type: "error",
                  payload: {
                    message: "Invalid game id",
                  },
                });
              games[data.payload.gameId].connections.push(conn);
              send(conn, {
                type: "joinGame",
                payload: {
                  success: true,
                  id: parseInt(data.payload.gameId),
                  board: games[data.payload.gameId].board,
                },
              });
              break;
            case "tileClick":
              if ( data.payload.action === "flag" ) {
                const tileData =
                  games[data.payload.gameId].board[data.payload.tileId];
                if (tileData.clicked) return;
                games[data.payload.gameId].board[data.payload.tileId] = {
                  ...tileData,
                  flagged: !tileData.flagged,
                };
              } else {
                const tileData =
                  games[data.payload.gameId].board[data.payload.tileId];
                if (tileData.flagged) return;
                games[data.payload.gameId].board[data.payload.tileId] = {
                  ...tileData,
                  clicked: true,
                };
              }

              broadcast(data.payload.gameId, {
                type: "tileClick",
                payload: {
                  board: games[data.payload.gameId].board,
                }
              });
              break;
          }
        } catch (e) {
          console.log(e)
          conn.close();
          return;
        }
    });
});

const send = (conn: WebSocket, message: VALID_OUTPUTS) => {
  conn.send(JSON.stringify(message));
}

const broadcast = (gameId: number, message: VALID_OUTPUTS) => {
  games[gameId].connections.forEach(conn => {
    conn.send(JSON.stringify(message));
  });
}