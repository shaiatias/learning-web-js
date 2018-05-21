import { Component } from '@angular/core';
import { GameBoardService } from './game-board.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(private gameBoardService: GameBoardService) { }

  restart() {
    this.gameBoardService.startGame();
  }
}
