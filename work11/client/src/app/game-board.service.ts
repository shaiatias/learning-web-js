import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import {map, tap} from "rxjs/operators";
import { Board, Cell } from './cell';

@Injectable({
  providedIn: 'root'
})
export class GameBoardService {

  private board = new BehaviorSubject<Board>(null);

  constructor(private http: HttpClient) { }

  getBoard(): Observable<Board> {
    return this.board.asObservable();
  }

  startGame() {

    this.http
      .get("http://localhost:8080/game/start-new-game")
      .subscribe(data => {
        this.board.next(<Cell[][]> data);
      });
  }
  
  moveElement(cell: Cell) {

    return this.http
      .post("http://localhost:8080/game/move-cell", { cell, board: this.board.value })
      .pipe(
        tap(data => {
          this.board.next(<Cell[][]> data);
        })
      )
      .toPromise();
  }

  isFinish() {

    return this.http
      .post("http://localhost:8080/game/did-finish", { board: this.board.value })
      .pipe(
        map(data => (<any>data).finish)
      )
      .toPromise();
  }
}
