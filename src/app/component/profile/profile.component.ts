import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service'
import { StorageService } from 'src/app/service/storage/storage.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  photoURL: String | undefined

  constructor(private authService: AuthService, private storageService: StorageService) {

  }

  ngOnInit() { }

  uploadPhoto(event: any) {
    this.storageService.storeImage(event.target.files[0]).then((url: any) => {
      if (url) {
        this.photoURL = url
        this.authService.updateProfile(url)
      }
    }).catch((reason: any) => {
      console.log(reason)
    })
  }

  profileName(): String {
    let profileName = this.authService.userData.displayName
    return profileName ? profileName : this.authService.userData.email
  }

  isEmailVerified(): boolean {
    return this.authService.userData.emailVerified
  }

  profileUrl(): String {
    let rtn = null
    rtn = rtn ? rtn : this.authService.userData.photoURL
    rtn = rtn ? rtn : this.photoURL
    rtn = rtn ? rtn : '/assets/social/default-128.png'
    return rtn
  }

  logout() {
    this.authService.logout()
  }

}
