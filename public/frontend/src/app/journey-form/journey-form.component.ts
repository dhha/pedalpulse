import { Component } from '@angular/core';
import { JourneyModel } from '../journey-model';
import { JourneyDataService } from '../journey-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import Helper from '../helper';

@Component({
  selector: 'app-journey-form',
  templateUrl: './journey-form.component.html',
  styleUrls: ['./journey-form.component.css']
})
export class JourneyFormComponent {
  journeyForm!: FormGroup;
  currentJourney!: JourneyModel;

  constructor(private _journeyService: JourneyDataService, private _activeRouter: ActivatedRoute, private _router: Router, private _formBuilder: FormBuilder){}

  ngOnInit() {
    const journeyId = this._activeRouter.snapshot.params["journeyId"];console.log(journeyId);

    this.journeyForm = new FormGroup({
      title: new FormControl(),
      start_date: new FormControl(),
      start_point: new FormControl(),
      start_lng: new FormControl(),
      start_lat: new FormControl(),
      end_point: new FormControl(),
      end_lng: new FormControl(),
      end_lat: new FormControl()
    });
    if(journeyId && journeyId != "") {
      this._journeyService.getOne(journeyId).subscribe({
        next: data => {
          this.currentJourney = data;
          const checkPoints = data.check_points? data.check_points : null;

          let startLocation: number[] = [];
          if(checkPoints && checkPoints[0]) {
            startLocation = checkPoints[0].location;
          }

          let endLocation: number[] = [];
          if(checkPoints && checkPoints[1]) {
            endLocation = checkPoints[1].location;
          }

          this.journeyForm = this._formBuilder.group({
            title: data.title,
            start_date: new Date(data.start_date).toISOString().split('T')[0],
            start_point: (checkPoints &&  checkPoints[0])? checkPoints[0].name: "",
            start_lng: startLocation? startLocation[0] : "",
            start_lat: startLocation? startLocation[1] : "",
            end_point: (checkPoints &&  checkPoints[1])? checkPoints[1].name : "",
            end_lng: endLocation? endLocation[0] : "",
            end_lat: endLocation? endLocation[1] : ""
          });
        }
      })
    }
  }

  submitForm() {
    const newJourney = {
      title: this.journeyForm.value['title'],
      start_date: this.journeyForm.value['start_date'] ? (new Date(this.journeyForm.value['start_date'])): null,
      check_points: {}
    }

    const checkPoints = [];
    if(this.journeyForm.value['start_point']) {
      const checkPoint = {
        name: this.journeyForm.value['start_point'],
        location: {}
      };

      if(this.journeyForm.value['start_lng'] && this.journeyForm.value['start_lat']) {
        checkPoint.location = [this.journeyForm.value['start_lng'], this.journeyForm.value['start_lat']];
      }

      checkPoints.push(checkPoint);
    }
    if(this.journeyForm.value['end_point']) {
      const checkPoint = {
        name: this.journeyForm.value['end_point'],
        location: {}
      };

      if(this.journeyForm.value['end_lng'] && this.journeyForm.value['end_lat']) {
        checkPoint.location = [this.journeyForm.value['end_lng'], this.journeyForm.value['end_lat']];
      }

      checkPoints.push(checkPoint);
    }

    newJourney.check_points = checkPoints;

    if(this.currentJourney) {
      this._journeyService.updateOne(this.currentJourney._id, newJourney).subscribe({
        next: data => {
          Helper.showSuccess('Great!', 'The journey is updated');
        },
        error: err => { Helper.showError(err)}
      })
    } else {
      this._journeyService.addOne(newJourney).subscribe({
        next: data => {
          Helper.showSuccess('Great!', 'The journey is created');
        },
        error: err => { Helper.showError(err);}
      })
    }
    
  }
}
