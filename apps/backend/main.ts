import { MinesweptServer } from './types/MinesweptWebsocket';
import { Player } from './types/Player';
import { generateBoard } from './Minesweeper';

import { type WebSocket, MessageEvent  } from 'ws';
import { VALID_INPUTS } from 'schemas'


const ms = new MinesweptServer(3001);

ms.ws.on('connection', (conn: any) => {

    const player = new Player(conn);
    ms.connections[player.uuid] = player;

    //conn.send(JSON.stringify({connected: true, uuid: player.uuid}));

    conn.on("message", (message: MessageEvent) => {
        // Parse message
        let data;

        try {
          data = VALID_INPUTS.parse(JSON.parse(message.toString()));
        } catch (e) {
            conn.send(JSON.stringify({success: false, message: "Invalid format"}));
            return;
        }

        handleEvent(conn, player.uuid, data);
    });
});

const handleEvent = (conn: WebSocket, uuid: string, data: { [key: string]: any } ) => {

    //TODO: Add checks for json fields. For testing/beta we just expect the client to send the proper fields.
    switch(data["type"]) {
        case "createGame":
            var gameId = ms.createGame(uuid, "default");
            
            ms.connections[uuid].gameId = gameId;
            ms.games[gameId].players.push(uuid);

            var board = generateBoard(8, 8);
            ms.games[gameId].board = board;

            ms.send(conn, {
                type: "createGame",
                payload: {
                  success: true,
                  gameId: gameId,
                  board: board,
                },
              });
            break;
        
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
        case "joinGame": 
            const gameToJoin = data.payload.gameId;
            //TODO: Add regex check for proper game id
            if(ms.getGame(gameToJoin) == null) {
                return ms.send(conn, {
                    type: "error",
                    payload: {
                      message: "Invalid game id",
                    },
                  });
            }

            ms.games[gameToJoin].players.push(uuid);
            ms.connections[uuid].gameId = gameToJoin;
            ms.send(conn, {
                type: "joinGame",
                payload: {
                  success: true,
                  gameId: parseInt(data.payload.gameId),
                  board: ms.games[data.payload.gameId].board,
                },
              });
            break;

        //TODO: Make
        /*
        case "gameEnd":
            var gameId = (ms.getPlayer(uuid) as Player).gameId; //Null check? Player should exist
            ms.games[gameId].state = GameState.ENDED;

            // Add success or failure? Client handled?
            ms.broadcastMessage(ms.getPlayer(uuid).gameId, uuid, JSON.stringify({type: "gameEnd"}));

            break;
        */
        case "tileClick":
            var gameId = (ms.getPlayer(uuid) as Player).gameId; //Null check? Player should exist
            if ( data.payload.action === "flag" ) {
              const tileData =
                ms.games[data.payload.gameId].board[data.payload.tileId];
              if (tileData.clicked) return;
              ms.games[data.payload.gameId].board[data.payload.tileId] = {
                ...tileData,
                flagged: !tileData.flagged,
              };
            } else {
              const tileData =
                ms.games[data.payload.gameId].board[data.payload.tileId];
              if (tileData.flagged) return;
              ms.games[data.payload.gameId].board[data.payload.tileId] = {
                ...tileData,
                clicked: true,
              };
            }
            
            // Use "" to override uuid check
            ms.broadcastMessage(data.payload.gameId, "", {
                type: "tileClick",
                payload: {
                  board: ms.games[data.payload.gameId].board,
                }});

            ms.games[gameId].progress.push(data["field"]);
            break;
        
        case "mouseMove":
            ms.broadcastMessage(ms.getPlayer(uuid).gameId, uuid, {
                type: "mouseMove", 
                payload: {
                    x: data["x"], 
                    y: data["y"], 
                    uuid
                }});

            break;
    }
}