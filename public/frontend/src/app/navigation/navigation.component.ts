import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  get isLogin() { return this._authenticationService.isloggedIn}
  get profile() { return this._authenticationService.tokenPayload }

  routerUrl: string = '';

  constructor(private router: ActivatedRoute, private _authenticationService: AuthenticationService){}

  ngOnInit() {
    console.log(this.router.url);
    // this.routerUrl = this.router.snapshot.url[];
  }

  logout() {
    this._authenticationService.logout();
  }
}
