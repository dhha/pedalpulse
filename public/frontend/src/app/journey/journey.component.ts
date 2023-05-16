import { Component } from '@angular/core';
import { JourneyModel } from '../journey-model';
import { JourneyDataService } from '../journey-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.css']
})
export class JourneyComponent {
  journey!: JourneyModel;

  constructor(private _journeyService: JourneyDataService, private _activeRouter: ActivatedRoute) {}

  ngOnInit() {
    const jouneyId = this._activeRouter.snapshot.params["journeyId"];
    this._journeyService.getOne(jouneyId).subscribe({
      next: data => this.journey = data,
      error: err => console.log("Api error", err)
    })
  }
}
