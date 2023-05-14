import { Component, OnInit } from '@angular/core';
import { GamesDataService } from '../games-data.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})

// export class Game {
//   #_id: string,
//   #_title: string,
//   #_price: Number
// }

export class GamesComponent implements OnInit{
  games: any[];

  constructor(private _gameService: GamesDataService) {
    this.games = [];
  }

  ngOnInit(): void {
    this._gameService.getAll().subscribe(
      {
        next: (games) => {
          this.games = games;
        },
        error: (err) => {
          console.log("Error getting games", err);
        },
        complete: () => {

        }
      }
    );
  }
}
