import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.sass']
})
export class NavComponent {

  constructor(public authService: AuthService, private breakpointObserver: BreakpointObserver) {

  }

  loggedIn(): boolean {
    return this.authService.isLoggedIn
  }

  loggedInWithPhoto(): boolean {
    if (this.loggedIn() && this.authService.userData.photoURL) {
      return true
    }
    return false
  }

  loggedInWithoutPhoto(): boolean {
    if (this.loggedIn() && !this.authService.userData.photoURL) {
      return true
    }
    return false
  }


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    )

}
