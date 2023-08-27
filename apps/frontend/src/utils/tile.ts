
export const COLUMN_SIZE = 10
export const ROW_SIZE = 10

export type TileState = {
    clicked: boolean,
    bomb: boolean,
    flagged: boolean,
}

export const DefaultTile: TileState = {
    clicked: false,
    bomb: false,
    flagged: false,
}