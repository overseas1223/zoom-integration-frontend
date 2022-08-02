
import { Component, OnInit } from '@angular/core'
import { AuthService } from 'src/app/service/auth/auth.service'

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.sass']
})
export class VerifyComponent {
  count = 0

  constructor(public authService: AuthService) {

  }

  log() {
    this.count++;
    console.log('Clicked!');
  }

}
