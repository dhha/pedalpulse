import { Component } from '@angular/core';
import Swal from 'sweetalert2'
import { JourneyModel } from '../journey-model';
import { JourneyDataService } from '../journey-data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-journeys',
  templateUrl: './journeys.component.html',
  styleUrls: ['./journeys.component.css']
})
export class JourneysComponent {
  journeys!: JourneyModel[];

  constructor(private _journeyService: JourneyDataService, private _router: Router) {}

  ngOnInit() {
    this.loadData();
  }

  delete(jouneyId: string) {
    Swal.fire({
      title: 'Are you sure!',
      text: 'Do you want to delete this journey',
      icon: "question",
      confirmButtonText: 'Yes',
      showCancelButton: true,
    }).then((result) => {
      if(result.value) {
        this._journeyService.deleteOne(jouneyId).subscribe({
          next: data => {
            Swal.fire({
              title: 'Great!',
              text: 'The journey is deleted',
              icon: "success",
            });
            this.loadData();
          },
          error: err => {
            console.log('Api Error', err);
          }
        })
      } else {
        console.log('cancel');
      }
      
    });
  }

  private loadData() {
    this._journeyService.getAll().subscribe({
      next: data => this.journeys = data,
      error: err => console.log("Api error", err)
    })
  }
}
