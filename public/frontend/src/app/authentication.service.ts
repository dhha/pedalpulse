import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  get isloggedIn() { return (null !== this.token) }

  get tokenPayload() { 
    if(this.token) {
      const payload = this._jwtHelper.decodeToken(this.token);
      return payload;
    }
    return null;
  }

  get token() { return localStorage.getItem("token") as string}

  set token(token: string) {
    localStorage.setItem("token", token);
  }

  constructor(private _jwtHelper: JwtHelperService) { }

  logout() {
    localStorage.clear();
  }
}
