import { v4 as uuidv4 } from "uuid";
import { WebSocket } from "ws";

interface IPlayer {
  conn: WebSocket;
  uuid: string;
  gameId: number;
}

class Player implements IPlayer {
  conn: WebSocket;
  uuid: string;
  gameId: number;

  constructor(conn: WebSocket) {
    this.conn = conn;
    this.uuid = uuidv4();
    this.gameId = 0;
  }
}

export { Player };
