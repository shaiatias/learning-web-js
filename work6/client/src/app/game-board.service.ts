import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, filter } from "rxjs/operators";

import * as io from 'socket.io-client';

import { Board, Cell, MultiplayerBoard } from './cell';

@Injectable({
  providedIn: 'root'
})
export class GameBoardService {

  private boards = new BehaviorSubject<MultiplayerBoard>({});
  private gameIsFinished = new BehaviorSubject(false);

  private url = 'http://localhost:8080';
  private socket;
  private socketId;

  constructor() {
    this.socket = io(this.url);

    this.socket.on('connect', message => {
      this.socketId = this.socket.id;
      console.log("connected", this.socketId);
      this.joinGame();
    });

    this.socket.on('game-completed', message => {
      this.gameIsFinished.next(true);
    });

    this.socket.on('boards-update', (message) => {
      const allBoards = <MultiplayerBoard> message.reduce((acc, item) => { acc[item.id] = item.game; return acc;}, {});
      this.boards.next(allBoards);
    });
  }

  getGameCompletedEvent(): Observable<boolean> {
    return this.gameIsFinished.asObservable()
    .pipe(
      filter(completed => completed === true)
    );
  }

  getMyBoard(): Observable<Board> {
    return this.boards.asObservable()
    .pipe(
      map(boards => boards[this.socketId])
    );
  }

  getAllBoards() {
    return this.boards.asObservable()
    .pipe(
      map(boards => Object.keys(boards)),
      map(ids => ids.filter(id => id !== this.socketId)),
      map(ids => ids.map(id => this.boards.value[id]))
    );
  }

  private joinGame() {
    this.socket.emit('join-game');
  }

  moveElement(cell: Cell) {
    this.socket.emit('move-cell', cell);
  }

  resetMyBoard() {
    this.socket.emit('reset-board');
  }
}
