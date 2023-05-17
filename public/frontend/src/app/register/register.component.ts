import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserDataService } from '../user-data.service';
import { UserModel } from '../user-model';
import Helper from '../helper';

class Profile{
  username: string;
  email: string;
  password!: string;
  confirm_password!: string;

  constructor(username: string, email: string) {
    this.username = username;
    this.email = email
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
          Helper.showWarning("Confirm password is not match");
        }

      } else {
        Helper.showWarning("Please enter password")
      }
      
    } else {
      Helper.showWarning("Please enter username")
    }
    
  }

  private _createUser() {
    const newUser = {
      username: this.registerForm.value["username"],
      password: this.registerForm.value["password"],
      email: this.registerForm.value["email"]
    }
      newUser.username = this.registerForm.value["username"];
      newUser.password = this.registerForm.value["password"];
      newUser.email = this.registerForm.value["email"];
  
      this._userService.addOne(newUser).subscribe({
        next: user => {
          Helper.showSuccess("Success!", "Congratulation registation has been created successful")
        },
        error: err => Helper.showError(err)
      })
  }
}
