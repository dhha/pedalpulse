import { Component } from '@angular/core';
import { JourneyModel } from '../journey-model';
import { JourneyDataService } from '../journey-data.service';
import { ActivatedRoute } from '@angular/router';
import Helper from '../helper';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.css']
})
export class JourneyComponent {
  journey!: JourneyModel;
  nearJourneys!: JourneyModel[];

  constructor(private _journeyService: JourneyDataService, private _activeRouter: ActivatedRoute) {
    
  }

  ngOnInit() {
    this._activeRouter.params.subscribe(routeParams => {
      this._loadData();
    });
  }

  private _loadData() {
    const jouneyId = this._activeRouter.snapshot.params["journeyId"];
      this._journeyService.getOne(jouneyId).subscribe({
        next: data => {
          this.journey = data;
          this._getNearBy();
        },
        error: err => Helper.showError(err)
      })
  }

  private _getNearBy() {
    if(this.journey && this.journey.check_points.length > 0) {
      const location: number[] = this.journey.check_points[0].location;
      const search = {
        lng: location[0],
        lat: location[1]
      };
      this._journeyService.getAll(0, 10, search).subscribe({
        next: data => {
          this.nearJourneys = data.filter(item => item._id != this.journey._id);
        },
        error: err => Helper.showError(err)
      })
    }
  }
}
