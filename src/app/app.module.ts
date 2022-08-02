import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AngularFireModule } from '@angular/fire/compat'
import { AngularFireAuthModule } from "@angular/fire/compat/auth"
import { FlexLayoutModule } from "@angular/flex-layout"
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { AuthService } from './service/auth/auth.service'

import { AppRoutingModule } from './app-routing.module'
import { AppMaterialModule } from './app-material.module'

import { AppComponent } from './app.component'

import { environment } from 'src/environments/environment'
import { ResetComponent } from './component/reset/reset.component'
import { HomeComponent } from './component/home/home.component'
import { LoginComponent } from './component/login/login.component'
import { ProfileComponent } from './component/profile/profile.component'
import { SignupComponent } from './component/signup/signup.component'
import { VerifyComponent } from './component/verify/verify.component'
import { AlertModule } from './service/alert'
import { DebounceClickDirective } from './directive/debounce.directive'
import { AuthGuard } from './service/auth/auth.guard'
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'
import { NavComponent } from './component/nav/nav.component'
import { ChatComponent } from './component/chat/chat.component'
import { AdminComponent } from './component/admin/admin.component'
import { AdminChatComponent } from './component/adminChat/adminChat.component'

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AdminChatComponent,
    ChatComponent,
    NavComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    ResetComponent,
    VerifyComponent,
    ProfileComponent,
    DebounceClickDirective
    ],
  imports: [
    AlertModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AppMaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],

  bootstrap: [AppComponent],
  providers: [AuthService, AuthGuard],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
