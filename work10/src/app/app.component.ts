import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GameBoardService } from './game-board.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(private gameBoardService: GameBoardService) { }

  restart() {
    this.gameBoardService.startGame();
  }
}
