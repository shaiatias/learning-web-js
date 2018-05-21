import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Board, Cell } from '../cell';
import { GameBoardService } from '../game-board.service';
import {map} from "rxjs/operators";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  board: Observable<Board> = null;

  constructor(private gameBoardService: GameBoardService) { }

  ngOnInit() {
    this.gameBoardService.startGame();
    this.board = this.gameBoardService
        .getBoard()
        .pipe(
          map(b => b.filter(cell => cell.visible))
        );
  }

  moveElement(cell: Cell) {
    this.gameBoardService.moveElement(cell);

    if (this.gameBoardService.isFinish()) {
      
      const result = confirm("game is completed, start new one?");

      if (result) {
        this.gameBoardService.startGame();
      }

    }
  }

  itemTrackBy(index: number, item: Cell) {
    return item.text;
  }
}
