import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent {

  constructor(public authService: AuthService) {

  }

}
