import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass']
})
export class SignupComponent {

  signup: FormGroup = new FormGroup({
    username: new FormControl('',[Validators.min(6), Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required ]),
    password: new FormControl('', [Validators.min(3), Validators.required ])
  })

  hide = true

  constructor(public authService: AuthService) {

  }

  get usernameInput(): FormControl {
    return this.signup.get('username') as FormControl
  }

  get emailInput(): FormControl {
    return this.signup.get('email') as FormControl
  }

  get passwordInput(): FormControl {
    return this.signup.get('password') as FormControl
  }

}
