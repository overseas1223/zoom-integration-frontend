import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.sass']
})

export class ResetComponent {

  reset: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required ])
  })

  constructor(public authService: AuthService){

  }

  get emailInput(): FormControl {
    return this.reset.get('email') as FormControl
  }

}
