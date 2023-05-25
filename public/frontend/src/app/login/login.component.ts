import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserDataService } from '../user-data.service';
import Helper from '../helper';
import { AuthenticationService } from '../authentication.service';

export class Token{
  #token!: string;

  get token() { return this.#token}
  set token(token: string) { this.#token = token}

  constructor(token: string) {
    this.token = token;
  }
}

export class Credential{
  #username!: string;
  #password!: string;

  get username() { return this.#username}
  set username(username: string) { this.#username = username}

  get password() { return this.#password}
  set password(password: string) { this.#password = password}

  constructor() {
  }

  fillFromForm(formData: FormGroup) {
    this.username = formData.value.username;
    this.password = formData.value.password;
  }

  toJson() {
    return {"username": this.username, "password": this.password};
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  loginForm!: FormGroup;
  credential: Credential = new Credential();

  get isLogin() { return this._authenticationService.isloggedIn };
  get profile() { return this._authenticationService.tokenPayload }

  constructor(private _userService: UserDataService, private _authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(),
      password: new FormControl()
    });
  }

  submitForm() {
    this.credential.fillFromForm(this.loginForm)
    this._userService.login(this.credential).subscribe({
      next: token => this.onLoginSuccess(token),
      error: err => Helper.showError(err)
    });
  }

  onLoginSuccess(token: Token) {
    this._authenticationService.token = token.token;
  }

  logOut() {
    this._authenticationService.logout();
  }
}
