import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Board, Cell } from '../cell';
import { GameBoardService } from '../game-board.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {

  @Input()
  board: Board;

  @Input()
  haveControl: boolean;

  constructor(private gameBoardService: GameBoardService) { }

  moveElement(cell: Cell) {
    
    if (!this.haveControl) {
      return;
    }

    this.gameBoardService.moveElement(cell);
  }
}
