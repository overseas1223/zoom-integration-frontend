import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {

  login: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required ]),
    password: new FormControl('', [Validators.required, Validators.min(3) ])
  })

  hide = true

  constructor(public authService: AuthService) {

  }

  get emailInput(): FormControl {
    return this.login.get('email') as FormControl
  }

  get passwordInput(): FormControl {
    return this.login.get('password') as FormControl
  }
}
