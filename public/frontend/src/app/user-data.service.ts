import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../environments/environment.development';
import { UserModel } from './user-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  baseUrl: string = environment.apiUrl + "/users";

  constructor(private _http: HttpClient) { }

  addOne(user: {}): Observable<UserModel> {
    return this._http.post<UserModel>(this.baseUrl, user);
  }
}
