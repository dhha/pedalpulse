import { Token, Credential } from './login/login.component';
import { Profile } from './register/register.component';
import { environment } from './../environments/environment';
import { UserModel } from './user-model';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class UserDataService {
  baseUrl: string = environment.apiUrl + "/users";

  constructor(private _http: HttpClient) { }

  addOne(user: Profile): Observable<UserModel> {
    return this._http.post<UserModel>(this.baseUrl, user);
  }

  login(userCredential: Credential): Observable<Token> {
    return this._http.post<Token>(this.baseUrl + '/login', userCredential.toJson());
  }
}
