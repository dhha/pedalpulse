import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CheckPoint } from './journey-model';

@Injectable({
  providedIn: 'root'
})
export class CheckPointDataService {
  baseApiUrl: string = environment.apiUrl + "/journeys/check-points/"

  constructor(private _http: HttpClient) { }

  addOne(journeyId: string, checkPoint: CheckPoint): Observable<CheckPoint> {
    const url = this.baseApiUrl + journeyId;
    return this._http.post<CheckPoint>(url, checkPoint.toJson());
  }

  deleteOne(journeyId: string, checkPointId: string): Observable<any> {
    const url = this.baseApiUrl + journeyId + '/' + checkPointId;
    return this._http.delete<any>(url);
  }

  updateOne(journeyId: string, checkPointId: string, checkPoint: CheckPoint): Observable<CheckPoint> {
    const url = this.baseApiUrl + journeyId + '/' + checkPointId;
    return this._http.put<CheckPoint>(url, checkPoint.toJson());
  }
  
}
