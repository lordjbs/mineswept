import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({
  port: 4000,
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    clientNoContextTakeover: true,
    serverNoContextTakeover: true,
    serverMaxWindowBits: 10,
    concurrencyLimit: 10,
    threshold: 1024
  },
  maxPayload: 2097152,

});

const connections: any[] = [];
const games: { [key: string]: {
  gameId: number
  host: any
  connections: any[]
  field: any
} } = {};

wss.on('connection', (conn) => {
    connections.push(conn);

    var gameId: number;
    conn.on("message", (message: MessageEvent) => {
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
              if(!games.hasOwnProperty(gameId)) return conn.send(JSON.stringify({type: "joinGame", success: false, message: "Invalid id"}));
              
              games[gameId].connections.push(conn);
              conn.send(JSON.stringify({type: "joinGame", success: true, field: games[gameId].field}))
              break;
            
            case "fieldClick":
              broadcastMessage(gameId, conn, JSON.stringify({type: "fieldClick", num: data["num"]}));
              break;
            
            case "mouseMove":
              broadcastMessage(gameId, conn, JSON.stringify({"type": "mouseMove", "x": data["x"], y: data["y"]}));
              break;
        }
    });
});

const broadcastMessage = (gameId: number, sender: any, message: string) => {
    games[gameId].connections.forEach(conn => {
        if(conn != sender)
            conn.send(message);
    });
}