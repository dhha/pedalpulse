import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JourneyModel } from './journey-model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class JourneyDataService {
  baseApiUrl: string = environment.apiUrl + "/journeys"
  constructor(private _http: HttpClient) {}

  getAll(offset: number, limit: number, search: any): Observable<JourneyModel[]> { console.log(search);
    let url = this.baseApiUrl + "?offset=" + offset + '&limit=' + limit;
    if(search) {
      for(var key in search) {
        url += '&' + key + '=' + search[key];
      }
    }
    return this._http.get<JourneyModel[]>(url);
  }

  addOne(journey: any): Observable<JourneyModel> {
    return this._http.post<JourneyModel>(this.baseApiUrl, journey);
  }

  getOne(journeyId: string): Observable<JourneyModel> {
    return this._http.get<JourneyModel>(this.baseApiUrl + '/' + journeyId);
  }

  updateOne(journeyId: string, body: any): Observable<JourneyModel> {
    return this._http.put<JourneyModel>(this.baseApiUrl + '/' + journeyId, body);
  }

  deleteOne(journeyId: string): Observable<any> {
    return this._http.delete<any>(this.baseApiUrl + '/' + journeyId);
  }
}
