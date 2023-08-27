import { WebSocketServer, type WebSocket } from "ws";

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

    let gameId: number;
    
    conn.on("message", (message: MessageEvent) => {
        // TODO - We should really enforce these types. Lol.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data: { [x: string]: any; type: any; };

        try {
          data = JSON.parse(message.toString());
        } catch (e) {
          conn.close();
          return;
        }

        switch(data["type"]) {
            case "createGame":
              gameId = Math.floor(Math.random() * 90000) + 10000;
              games[gameId] = {gameId: gameId, host: conn, connections: [conn], field: null};

              conn.send(JSON.stringify({type: "createGame", success: true, id: gameId}));
              break;
            
            case "gameField":
              if(games[gameId].host != conn) return conn.send(JSON.stringify({type: "gameField", success: false, message: "Not host"}));
              games[gameId].field = data["field"];

              conn.send(JSON.stringify({type: "gameField", success: true}));
              break;
            case "joinGame":
              gameId = data["id"];
              // TODO - Should really check if the game exists.
              // eslint-disable-next-line no-prototype-builtins
              if(!games.hasOwnProperty(gameId)) return conn.send(JSON.stringify({type: "joinGame", success: false, message: "Invalid id"}));
              games[gameId].connections.push(conn);
              conn.send(JSON.stringify({type: "joinGame", success: true, id: gameId, field: games[gameId].field}))
              break;
            
            case "tileClick":
              broadcastMessage(
                gameId,
                conn,
                JSON.stringify({ type: "tileClick", num: data["num"] })
              );
              break;
            
            case "mouseMove":
              broadcastMessage(gameId, conn, JSON.stringify({"type": "mouseMove", "x": data["x"], y: data["y"]}));
              break;
        }
    });
});

const broadcastMessage = (gameId: number, sender: WebSocket, message: string) => {
  games[gameId].connections.forEach(conn => {
    if(conn != sender)
      conn.send(message);
  });
}