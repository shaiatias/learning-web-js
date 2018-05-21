import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Board, Cell } from './cell';

@Injectable({
  providedIn: 'root'
})
export class GameBoardService {

  private board = new BehaviorSubject<Board>(null);

  getBoard(): Observable<Board> {
    return this.board.asObservable();
  }

  private *getNumberGenerator() {

    const arr = [];

    for (let i = 0; i < 16; i++) {
      arr.push(i + 1);
    }

    for (let i = 0; i < 16; i++) {

      const randI = Math.floor(Math.random() * arr.length);
      const value = arr[randI];

      arr.splice(randI, 1);

      yield value;
    }

  }

  private getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);

    return `rgb(${r},${g},${b})`;
  }

  startGame() {

    const gen = this.getNumberGenerator();
    const b: Board = [];

    for (let i = 0; i < 4; i++) {

      for (let j = 0; j < 4; j++) {

        const text = gen.next().value;
        const visible = text !== 16;
        const color = this.getRandomColor();

        b[i * 4 + j] = {
          color,
          text,
          visible,
          row: i,
          column: j
        }
      }
    }

    this.board.next(b);
  }

  private getEmptyNearCell(board: Board, cell: Cell): Cell | null {

    for (let i = 0; i < 4; i++) {

      for (let j = 0; j < 4; j++) {

        const dist = Math.abs(cell.row - i) + Math.abs(cell.column - j);

        if (dist === 1 && board[i * 4 + j].text === 16) {
          return Object.assign({}, board[i * 4 + j]);
        }
      }
    }

    return null;
  }

  moveElement(cell: Cell) {

    const empty = this.getEmptyNearCell(this.board.value, cell);

    if (empty) {
      const board = this.board.value;

      board[empty.row * 4 + empty.column].color = cell.color;
      board[empty.row * 4 + empty.column].text = cell.text;
      board[empty.row * 4 + empty.column].visible = cell.visible;

      board[cell.row * 4 + cell.column].color = empty.color;
      board[cell.row * 4 + cell.column].text = empty.text;
      board[cell.row * 4 + cell.column].visible = empty.visible;

      this.board.next(board);
    }
  }

  isFinish() {
    return (
      this.board.value[0].text === 1 &&
      this.board.value[1].text === 2
    );
  }
}
