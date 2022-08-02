import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection  } from '@angular/fire/compat/firestore'

import { GoogleAuthProvider } from "firebase/auth"
import { User } from './user.model';
import { AlertService } from '../alert';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any | undefined
  items: any | []
  role: any | 'user'

  options = {
    autoClose: true,
    fade: false,
    keepAfterRouteChange: false
  }

  constructor(private alertService: AlertService, private afs: AngularFirestore, private afAuth: AngularFireAuth, private router: Router) {
    this.userData = null
    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.userData = user
        this.setUserRole()
      }
    })
  }

  get isLoggedIn(): boolean {
    return this.userData ? true : false
  }

  getProfileName(): string {
    let rtn = ""
    if (this.isLoggedIn) {
      let displayName = this.userData.displayName
      let email = this.userData.email
      let emailName = email.substring(0, email.indexOf("@"))
      rtn = displayName ? displayName : emailName
    }
    return rtn
  }

  async signup(username: string, email: string, password: string) {
    if (username.trim().length == 0) {
      this.alertService.error('The username is missing.', this.options)
      return
    }
    if (email.trim().length == 0) {
      this.alertService.error('The email is missing.', this.options)
      return
    }
    if (password.trim().length == 0) {
      this.alertService.error('The password is missing.', this.options)
      return
    }
    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(result => {
        this.verify()
        this.saveUser(result.user)
      })
      .catch(error => {
        this.alertService.error(this.clean(error), this.options)
      })
  }

  async verify() {
    return this.afAuth.currentUser.then((user) => {
      return user!.sendEmailVerification()
    }).then(() => {
      this.router.navigate(['/verify'])
    })
      .catch((error) => {
        this.alertService.error(this.clean(error), this.options)
      })

  }

  async login(email: string, password: string) {
    if (email.trim().length == 0) {
      this.alertService.error('The email is missing.', this.options)
      return
    }
    if (password.trim().length == 0) {
      this.alertService.error('The password is missing.', this.options)
      return
    }
    this.afAuth.signInWithEmailAndPassword(email, password)
      .then(value => {
        this.router.navigateByUrl('/profile')
      })
      .catch((error) => {
        this.alertService.error(this.clean(error), this.options)
      })
  }

  async reset(email: string) {
    try {
      await this.afAuth.sendPasswordResetEmail(email)
      this.alertService.info('Password reset email sent, check your inbox.', this.options)
    } catch (error: any) {
      this.alertService.error(this.clean(error), this.options)
    }
  }

  async googleLogin() {
    const provider = new GoogleAuthProvider()
    try {
      const value = await this.oAuthLogin(provider)
      this.router.navigateByUrl('/profile');
    } catch (error: any) {
      this.alertService.error(this.clean(error), this.options)
    }
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.userData = undefined
      this.router.navigate(['/'])
    });
  }

  getUserRole() {
    return this.role
  }

  setUserRole() {
    let that = this
    this.afs.collection("users")
            .doc(this.userData.uid)
            .ref
            .get().then(function(doc): any {
                if (doc.exists) {
                  const res: any = doc.data()
                  that.userData = res
                  if(res.admin) {
                    that.role = 'admin'
                  } else {
                    that.role = 'user'
                  }
                } else {
                }
            }).catch(function(error) {
            });
  }

  saveUser(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoUrl: user.photoURL,
      emailVerified: user.emailVerified,
      admin: false
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  updateProfile(photoURL: string) {
    return this.userData.updateProfile({
      photoURL: photoURL
    })

  }

  private oAuthLogin(provider: GoogleAuthProvider) {
    return this.afAuth.signInWithPopup(provider);
  }

  private clean(error: any): string {
    let message = error.message as string
    if (error.code == "auth/missing-email") {
      message = 'The email address is missing.'
    }
    else if (error.code == "auth/too-many-requests") {
      message = 'Please check you spam folders .'
    }
    else {
      if (message.indexOf("Firebase:") >= 0) {
        message = message.replace("Firebase:", "").trim()
      }
      if (message.indexOf(".") > 0) {
        message = message.substring(0, message.indexOf(".")).trim()
      }
      if (message.indexOf("(") > 0) {
        message = message.substring(0, message.indexOf("(")).trim()
      }

    }
    return message
  }

}
