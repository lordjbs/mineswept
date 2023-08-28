import { generateBoard, revealFields } from "./Minesweeper";
import { MinesweptServer } from "./types/MinesweptWebsocket";
import { Player } from "./types/Player";

import { VALID_INPUTS } from "schemas";
import { MessageEvent, type WebSocket } from "ws";

const ms = new MinesweptServer(3001);

ms.ws.on("connection", (conn: WebSocket) => {
  const player = new Player(conn);
  ms.connections[player.uuid] = player;

  //conn.send(JSON.stringify({connected: true, uuid: player.uuid}));

  conn.on("message", (message: MessageEvent) => {
    // Parse message
    let data;

    try {
      data = VALID_INPUTS.parse(JSON.parse(message.toString()));
    } catch (e) {
      conn.send(JSON.stringify({ success: false, message: "Invalid format" }));
      return;
    }

    handleEvent(conn, player.uuid, data);
  });
});

const handleEvent = (conn: WebSocket, uuid: string, data: VALID_INPUTS) => {
  //TODO: Add checks for json fields. For testing/beta we just expect the client to send the proper fields.
  switch (data["type"]) {
    case "createGame": {
      const newGameId = ms.createGame(uuid, "default");
      ms.connections[uuid].gameId = newGameId;
      ms.games[newGameId].players.push(uuid);
      const board = generateBoard(8, 8);
      ms.games[newGameId].board = board;
      ms.send(conn, {
        type: "createGame",
        payload: {
          success: true,
          gameId: newGameId,
          board: board,
        },
      });
      break;
    }
    //TODO: Finish
    /*case "startGame": 
            // First start is only host
            var player = ms.getPlayer(uuid); // No null check needed as player should exist
            if(player.gameId == null) return conn.send(JSON.stringify({success: false, type: "startGame", message: "Player is not in a game"}));

            // Request a field 
            var game = ms.getGame(data["gameId"]);
            if(game.host != uuid) return conn.send(JSON.stringify({success: false, type: "startGame", message: "Player is not the host"}));
            
            ms.getPlayer(game.host).conn.send(JSON.stringify({type: "request", requestType: "field"}));
            
            break;

        //TODO: Finish
        case "remakeGame":
            //TODO: make host only?
            var gameId = ms.getPlayer(uuid).gameId as number;
            var game = ms.getGame(gameId);

            conn.send(JSON.stringify({success: true, type: "remakeGame"}));
            ms.broadcastMessage(ms.getPlayer(uuid).gameId, uuid, JSON.stringify({type: "remakeGame"}));
            // Request a newly generated field from the host
            ms.getPlayer(game.host).conn.send(JSON.stringify({type: "request", requestType: "field"}));

            ms.games[gameId].state = GameState.INGAME;

            break;
        */
    case "joinGame": {
      const gameId = parseInt(data.payload.gameId);
      //TODO: Add regex check for proper game id
      if (ms.getGame(gameId) == null) {
        return ms.send(conn, {
          type: "error",
          payload: {
            message: "Invalid game id",
          },
        });
      }

      ms.games[gameId].players.push(uuid);
      ms.connections[uuid].gameId = gameId;
      ms.send(conn, {
        type: "joinGame",
        payload: {
          success: true,
          gameId: parseInt(data.payload.gameId),
          board: ms.games[gameId].board,
        },
      });
      break;
    }

    //TODO: Make
    /*
        case "gameEnd":
            var gameId = (ms.getPlayer(uuid) as Player).gameId; //Null check? Player should exist
            ms.games[gameId].state = GameState.ENDED;

            // Add success or failure? Client handled?
            ms.broadcastMessage(ms.getPlayer(uuid).gameId, uuid, JSON.stringify({type: "gameEnd"}));

            break;
        */
    case "tileClick": {
      const player = ms.getPlayer(uuid);
      if (player == undefined) return;
      const newGameId = player.gameId;
      const tileData = ms.games[newGameId].board[data.payload.tileId];
      if (data.payload.action === "flag") {
        if (tileData.clicked) return;
        ms.games[newGameId].board[data.payload.tileId] = {
          ...tileData,
          flagged: !tileData.flagged,
        };
      } else {
        if (tileData.flagged) return;
        ms.games[newGameId].board[data.payload.tileId] = {
          ...tileData,
          clicked: true,
        };
      }

      revealFields(player.gameId, data.payload.tileId, undefined);

      // Use "" to override uuid check
      ms.broadcastMessage(data.payload.gameId, "", {
        type: "tileClick",
        payload: {
          board: ms.games[data.payload.gameId].board,
        },
      });

      // ms.games[newGameId].progress.push(data["field"]);
      break;
    }

    case "mouseMove": {
      const _player = ms.getPlayer(uuid);
      if (_player === undefined) return;
      ms.broadcastMessage(_player.gameId, uuid, {
        type: "mouseMove",
        payload: data.payload,
      });

      break;
    }
  }
};

export { ms };

