import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(private _authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    const req = this.addAuthenticationToken(request);
    return next.handle(req);
  }

  addAuthenticationToken(request: HttpRequest<unknown>): HttpRequest<unknown>{
    const token = this._authenticationService.token;

    if(token) {
      return request.clone({
        setHeaders: {
          Authorization: "Bearer " + token
        }
      });
    }
    
    return request;
  }
}
