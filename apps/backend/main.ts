import { WebSocketServer, type WebSocket, MessageEvent } from "ws";
import { VALID_INPUTS, VALID_OUTPUTS } from 'schemas'

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
    field: number | null;
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
                field: null,
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
                  field: games[data.payload.gameId].field,
                },
              });
              break;
            case "tileClick":
              broadcast(data.payload.gameId, conn, {
                type: "tileClick",
                payload: {
                  tileId: data.payload.tileId,
                  action: data.payload.action,
                },
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

const broadcast = (gameId: number, sender: WebSocket, message: VALID_OUTPUTS) => {
  games[gameId].connections.forEach(conn => {
    if(conn != sender)
      conn.send(JSON.stringify(message));
  });
}