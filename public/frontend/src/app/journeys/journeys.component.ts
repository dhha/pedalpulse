import { Component, Input } from '@angular/core';
import Swal from 'sweetalert2'
import { JourneyModel } from '../journey-model';
import { JourneyDataService } from '../journey-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import Helper from '../helper';

@Component({
  selector: 'app-journeys',
  templateUrl: './journeys.component.html',
  styleUrls: ['./journeys.component.css']
})
export class JourneysComponent {
  journeys!: JourneyModel[];
  offset: number = 0;
  limit: number = 10;
  resultCount: number = 0;
  search: any = [];

  @Input()
  searchTermInput: string = "";

  constructor(private _journeyService: JourneyDataService, private _router: Router) {}

  ngOnInit() {
    this.loadData();
  }

  delete(jouneyId: string) {
    Helper.showConfirm("Are you sure!", "Do you want to delete this journey", () => {
      this._journeyService.deleteOne(jouneyId).subscribe({
        next: data => {
          Helper.showSuccess('Great!', 'The journey is deleted');
          this.loadData();
        },
        error: err => {
          Helper.showError(err);
        }
      })
    });
    
    // Swal.fire({
    //   title: 'Are you sure!',
    //   text: 'Do you want to delete this journey',
    //   icon: "question",
    //   confirmButtonText: 'Yes',
    //   showCancelButton: true,
    // }).then((result) => {
    //   if(result.value) {
        
    //   } else {
    //     console.log('cancel');
    //   }
      
    // });
  }

  private loadData() {
    this._journeyService.getAll(this.offset, this.limit, this.search).subscribe({
      next: data => {
        this.journeys = data;
        this.resultCount = data.length;
      },
      error: err => Helper.showError(err)
    })
  }

  previousPage() {
    this.offset -= this.limit;
    this.loadData();
  }

  nextPage() {
    this.offset += this.limit;
    this.loadData();
  }

  onChangeLimit(event: any) {
    this.limit = parseInt(event.target.value);
    this.offset = 0;
    this.loadData();
  }

  searchByName() {
    this.search.term = this.searchTermInput;
    this.loadData();
  }
}
