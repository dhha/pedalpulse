import { Component, OnInit } from '@angular/core';
import { GamesDataService } from '../games-data.service';
import { ActivatedRoute } from "@angular/router"

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  game!: any;
  constructor(private _gameService: GamesDataService, private _route: ActivatedRoute) {}
  
  ngOnInit(): void {
    let gameId = this._route.snapshot.params["id"];
    this._gameService.getOne(gameId).subscribe({
      next: (game) => {
        this.game = game;
      },
      error: (err) => {
        console.log("Error", err);
      }
    })
    
  }

}
