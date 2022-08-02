import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { HomeComponent } from './component/home/home.component'
import { ResetComponent } from './component/reset/reset.component'
import { LoginComponent } from './component/login/login.component'
import { ProfileComponent } from './component/profile/profile.component'
import { SignupComponent } from './component/signup/signup.component'
import { VerifyComponent } from './component/verify/verify.component'
import { AuthGuard } from './service/auth/auth.guard'
import { AdminComponent } from './component/admin/admin.component'

const routes: Routes = [

  // Open Routes
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset', component: ResetComponent },
  { path: 'signup', component: SignupComponent },

  // Guarded Routes
  { path: 'verify', component: VerifyComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
