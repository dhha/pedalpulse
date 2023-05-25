import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CheckPoint } from '../journey-model';
import { FormControl, FormGroup } from '@angular/forms';
import { CheckPointDataService } from '../check-point-data.service';
import Helper from '../helper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-check-point',
  templateUrl: './check-point.component.html',
  styleUrls: ['./check-point.component.css']
})
export class CheckPointComponent {
  editMode: boolean = false;

  @Input()
  journeyId!: string;

  @Input()
  check_point!: CheckPoint;

  @Input()
  currentCheckPoint!: CheckPoint;

  @Output()
  onDelete: EventEmitter<CheckPoint> = new EventEmitter<CheckPoint>();

  @Output()
  onUpdate: EventEmitter<CheckPoint> = new EventEmitter<CheckPoint>();

  @Output()
  onCreate: EventEmitter<CheckPoint> = new EventEmitter<CheckPoint>();

  constructor(private _checkPointService: CheckPointDataService) {}

  ngOnInit() {
    this.currentCheckPoint = new CheckPoint(this.check_point.name, this.check_point.location);
    if(!this.check_point._id) {
      this.editMode = true;
    }
  }

  create() {
    this._checkPointService.addOne(this.journeyId, this.currentCheckPoint).subscribe({
      next: (createdCheckPoint) => this.onCreatedSuccess(createdCheckPoint),
      error: (error) => this.onHandleError(error)
    })
  }

  onCreatedSuccess(createdCheckPoint: CheckPoint): void {
    this.currentCheckPoint = createdCheckPoint;
    this.onCreate.emit(createdCheckPoint);
  }

  onHandleError(error: any) {
    Helper.showError(error);
  }

  update() {
    console.log("value", this.currentCheckPoint);
    if(this.check_point._id) {
      this._checkPointService.updateOne(this.journeyId, this.check_point._id, this.currentCheckPoint).subscribe({
        next: updatedCheckPoint => this.onSuccessUpdate(updatedCheckPoint),
        error: error => this.onHandleError(error)
      });
    }
  }

  onSuccessUpdate(updatedCheckPoint: CheckPoint): void {
    this.onUpdate.emit(updatedCheckPoint);
    Helper.showSuccess(environment.msgTitleSuccess, environment.msgCheckPointUpdated);
  }
  
  edit() {
    this.editMode = !this.editMode;
  }

  delete() {
    if(this.check_point._id) {
        Helper.showConfirm(environment.msgAreYouSure, environment.msgAreYouSureDeleteCheckPoint, () => {
        this._checkPointService.deleteOne(this.journeyId, this.check_point._id).subscribe({
          next: result => this.onSuccessDelete(),
          error: error => this.onHandleError(error)
        });
      })
    } else {
      this.onSuccessDelete();
    }
  }

  onSuccessDelete() {
    this.onDelete.emit(this.check_point);
    Helper.showSuccess(environment.msgTitleSuccess, environment.msgCheckPointDeleted);
  }

  cancel() {
    console.log(this.check_point);
    this.currentCheckPoint.name = this.check_point.name;
    this.editMode = !this.editMode;
  }
}
