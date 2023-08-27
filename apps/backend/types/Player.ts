import {v4 as uuidv4} from 'uuid';

interface IPlayer {
    conn: any,
    uuid: string,
    gameId: number
}

class Player implements IPlayer {
    conn: any;
    uuid: string;
    gameId: number;

    constructor(conn: any) {
        this.conn = conn;
        this.uuid = uuidv4();
        this.gameId = 0;
    }
}

export { Player }