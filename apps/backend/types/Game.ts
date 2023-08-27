import { TileState } from 'schemas'


interface IGame {
    gameId: number,
    gameMode: string,
    host: string,
    players: string[],
    state: GameState,
    board: TileState[];
    progress: number[];
}

class Game implements IGame {
    gameId: number;
    gameMode: string;
    host: string;
    players: string[];
    state: GameState;
    board: TileState[];
    progress: number[];

    constructor(gameId: number, gameMode: string, host: string) {
        this.gameId = gameId;
        this.gameMode = gameMode;
        this.host = host;
        this.players = [];
        this.board = [];
        this.state = GameState.LOBBY; // Games should always start in lobby
        this.progress = []; // this is awful TODO: Change this to server based game!!!!
    } 
}

enum GameState {
    LOBBY, INGAME, ENDED
}

export {Game, GameState}