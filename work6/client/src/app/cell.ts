
export interface Cell {
    row: number,
    column: number,
    color: string,
    text: number,
    visible: boolean
}

export type Board = Array<Array<Cell>>;

export interface MultiplayerBoard {
    [socketId: string]: Board
}
