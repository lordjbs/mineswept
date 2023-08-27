import { TileState } from "schemas";

export const COLUMN_SIZE = 8;
export const ROW_SIZE = 8;

export const DefaultTile: TileState = {
  clicked: false,
  bomb: false,
  flagged: false,
  nearby: 0,
};
