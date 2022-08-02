import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private afAuth: AngularFireAuth) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        return new Promise((resolve, reject) => {
            this.afAuth.onAuthStateChanged((user) => {
                if (user) {
                    resolve(true);
                } else {
                    this.router.navigate(['/'])
                    resolve(false)
                }
            })
        })

    }

}
