import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Journey } from './journey-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JourneyDataService {
  baseApiUrl: string = environment.apiUrl + "/journeys"
  constructor(private _http: HttpClient) {}

  getAll(offset: number, limit: number, search: any): Observable<Journey[]> {
    let url = this.baseApiUrl + "?offset=" + offset + '&limit=' + limit;
    if(search) {
      for(var key in search) {
        url += '&' + key + '=' + search[key];
      }
    }
    return this._http.get<Journey[]>(url);
  }

  addOne(journey: Journey): Observable<Journey> {
    return this._http.post<Journey>(this.baseApiUrl, journey.toJson());
  }

  getOne(journeyId: string): Observable<Journey> {
    return this._http.get<Journey>(this.baseApiUrl + '/' + journeyId);
  }

  updateOne(journeyId: string, journey: Journey): Observable<Journey> {
    return this._http.put<Journey>(this.baseApiUrl + '/' + journeyId, journey.toJson());
  }

  deleteOne(journeyId: string): Observable<any> {
    return this._http.delete<any>(this.baseApiUrl + '/' + journeyId);
  }
}
