import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Journey } from '../journey-model';
import { JourneyDataService } from '../journey-data.service';
import Helper from '../helper';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.css']
})
export class JourneyComponent {

  get isLogin() { return this._authenticationService.isloggedIn };
  journey!: Journey;
  nearJourneys!: Journey[];

  constructor(private _journeyService: JourneyDataService, private _activeRouter: ActivatedRoute, private _authenticationService: AuthenticationService) {
    
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
      this._journeyService.getAll(0, environment.defaultLimit, search).subscribe({
        next: data => {
          this.nearJourneys = data.filter(item => item._id != this.journey._id);
        },
        error: err => Helper.showError(err)
      })
    }
  }
}
