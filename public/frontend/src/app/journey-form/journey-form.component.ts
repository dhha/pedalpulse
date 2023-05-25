import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Journey, CheckPoint } from '../journey-model';
import { JourneyDataService } from '../journey-data.service';
import Helper from '../helper';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-journey-form',
  templateUrl: './journey-form.component.html',
  styleUrls: ['./journey-form.component.css']
})
export class JourneyFormComponent {

  get isLogin() { return this._authenticationService.isloggedIn };
  journeyForm!: FormGroup;
  currentJourney: Journey = new Journey();
  journey: Journey = new Journey();
  extraPoints: CheckPoint[] = [];

  constructor(
    private _journeyService: JourneyDataService, 
    private _activeRouter: ActivatedRoute, 
    private _router: Router, 
    private _formBuilder: FormBuilder, 
    private _authenticationService: AuthenticationService
  ){}

  ngOnInit() {
    const journeyId = this._activeRouter.snapshot.params["journeyId"];
    this._onInitFormGroup();
    if(journeyId && journeyId != "") {
      this._journeyService.getOne(journeyId).subscribe({
        next: journey => this._onLoadJourneyToForm(journey),
        error: error => Helper.showError(error)
      })
    }
  }

  private _onInitFormGroup() {
    this.journeyForm = new FormGroup({
      title: new FormControl(),
      start_date: new FormControl(),
      start_point: new FormControl(),
      start_lng: new FormControl(),
      start_lat: new FormControl(),
      end_point: new FormControl(),
      end_lng: new FormControl(),
      end_lat: new FormControl(),
      check_points: new FormControl()
    });
  }

  private _onLoadJourneyToForm(journey: Journey) {
    this.currentJourney = journey; 
    const checkPoints = journey.check_points? journey.check_points : null;

    let startLocation: number[] = [];
    if(checkPoints && checkPoints[0]) {
      startLocation = checkPoints[0].location;
    }

    let endLocation: number[] = [];
    if(checkPoints && checkPoints[1]) {
      endLocation = checkPoints[1].location;
    }

    this.journeyForm = this._formBuilder.group({
      title: journey.title,
      start_date: new Date(journey.start_date).toISOString().split('T')[0],
      start_point: (checkPoints &&  checkPoints[0])? checkPoints[0].name: "",
      start_lng: startLocation? startLocation[0] : "",
      start_lat: startLocation? startLocation[1] : "",
      end_point: (checkPoints &&  checkPoints[1])? checkPoints[1].name : "",
      end_lng: endLocation? endLocation[0] : "",
      end_lat: endLocation? endLocation[1] : "",
      check_points: checkPoints
    });

    if(checkPoints && checkPoints.length > 2) {
      checkPoints.map((point, index) => {
        if(index > 1) {
          this.extraPoints.push(point);
        }
      })
    }
  }

  submitForm() {
    this.journey.fillfromForm(this.journeyForm);

    if(this.currentJourney._id) {
      this._journeyService.updateOne(this.currentJourney._id, this.journey).subscribe({
        next: data => Helper.showSuccess(environment.msgTitleSuccess, environment.msgJourneyUpdatedSuccess),
        error: err => { Helper.showError(err)}
      })
    } else {
      this._journeyService.addOne(this.journey).subscribe({
        next: data => {
          Helper.showSuccess(environment.msgTitleSuccess, environment.msgJourneyCreatedSuccess);
          this._router.navigate(["journeys"]);
        },
        error: err => { Helper.showError(err);}
      })
    }
    
  }

  addCheckPoint() {
    const checkPoint = new CheckPoint("", []);
    this.extraPoints.push(checkPoint);
  }

  private _removeLastEmptyCheckPoint() {

    this.extraPoints.map(point => {
      if(!point._id) {
        const index = this.extraPoints.indexOf(point);
        this.extraPoints.splice(index, 1);
      }
    })
  }

  deleteCheckPoint(checkPoint: CheckPoint) {console.log(checkPoint);
    if(checkPoint._id) {
      const index = this.extraPoints.findIndex(i => i._id == checkPoint._id);
      this.extraPoints.splice(index, 1);
    } else {
      this._removeLastEmptyCheckPoint();
    }
  }

  updateCheckPoint(checkPoint: CheckPoint) {
    const index = this.extraPoints.findIndex(i => i._id == checkPoint._id);
    this.extraPoints.splice(index, 1, checkPoint);
  }

  createCheckPoint(checkPoint: CheckPoint) {
    this._removeLastEmptyCheckPoint();
    this.extraPoints.push(checkPoint);
  }
}
