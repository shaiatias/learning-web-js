import { Component, OnInit } from '@angular/core';
import { GameBoardService } from './game-board.service';
import { Observable } from 'rxjs';
import { Board } from './cell';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  allBoard: Observable<Board[]>;
  myBoard: Observable<Board>;

  constructor(private gameBoardService: GameBoardService) { }

  ngOnInit() {
    this.allBoard = this.gameBoardService.getAllBoards();
    this.myBoard = this.gameBoardService.getMyBoard();

    this.gameBoardService.getGameCompletedEvent()
      .subscribe(data => {

        const result = confirm("game is completed, start new one?");

        if (result) {
          this.gameBoardService.resetMyBoard();
        }

      });
  }

  restart() {
    this.gameBoardService.resetMyBoard();
  }
}
