import { Component, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { UserDataService } from '../user-data.service';
import { UserModel } from '../user-model';
import Helper from '../helper';
import { environment } from 'src/environments/environment';

export class Profile{
  first_name!: string;
  username: string;
  email: string;
  password!: string;
  confirm_password!: string;

  constructor(username: string, email: string) {
    this.username = username;
    this.email = email
  }

  fillFromForm(formdata: NgForm) {
    this.first_name = formdata.value.first_name;
    this.username = formdata.value.username;
    this.email = formdata.value.email;
    this.password = formdata.value.password;
  }

  toJson() {
    return {"first_name": this.first_name, "email": this.email, "username": this.username, "password": this.password};
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  user!: Profile;

  @ViewChild("registerForm")
  registerForm!: NgForm;

  constructor(private _userService: UserDataService){}

  ngOnInit() {
    this.user = new Profile("", "");
  }

  register() {
    if(this.registerForm.value["username"] && this.registerForm.value["username"] != '') {
      if(this.registerForm.value["password"] && this.registerForm.value["confirm_password"]) {
        if(this.registerForm.value["password"] == this.registerForm.value["confirm_password"]) {
          this._createUser();
        }else {
          Helper.showWarning(environment.msgRegisterConfirmPasswordNoMatch);
        }

      } else {
        Helper.showWarning(environment.msgRegisterPleaseEnterPassword)
      }
      
    } else {
      Helper.showWarning(environment.msgRegisterPleaseEnterUserName)
    }
    
  }

  private _createUser() {
    this.user.fillFromForm(this.registerForm);
  
    this._userService.addOne(this.user).subscribe({
      next: (user) => this.onSuccessRegister(user),
      error: (err) => this.onFailureRegister(err)
    });
  }

  private onSuccessRegister(user: UserModel) {
    Helper.showSuccess(environment.msgRegisterSuccessTitle, environment.msgRegisterSuccess)
  }

  private onFailureRegister(error: any) {
    Helper.showError(error);
  }
}
