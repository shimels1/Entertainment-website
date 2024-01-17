// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./navigation/header/header.component";
import { SidnavComponent } from "./navigation/sidnav/sidnav.component";
import { HomeComponent } from "./home/home.component";
import { VideoCardComponent } from "./video-card/video-card.component";
import { FooterComponent } from "./footer/footer.component";
import { MobVideoCardComponent } from "./mob-video-card/mob-video-card.component";
import {
  MatSidenavModule,
  MatToolbarModule,
  MatMenuModule,
} from "@angular/material";
import { CategoryViewComponent } from "./category-view/category-view.component";
import { PlayVideoComponent } from "./play-video/play-video.component";
import { sidenaveService } from "./services/sidenavService";
import { ShareDialogItems } from "./play-video/shareDialog";
import { NextPlayVideoCardComponent } from "./next-play-video-card/next-play-video-card.component";
import { CatagoryVideoCardComponent } from "./catagory-video-card/catagory-video-card.component";
import { CommentCardComponent } from "./comment-card/comment-card.component";
import { LoginDialog } from "./navigation/header/loginDialog";
import {
  SocialLoginModule,
  AuthServiceConfig,
  LoginOpt,
} from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { AuthGuardUserLogin } from "./services/auth-guardUserLogin.service";
import { StaffAuthService } from "./services/staff-auth.service";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { JwSocialButtonsModule } from "jw-angular-social-buttons";
import { UserAuthService } from "./services/userAuth.service";
import { VideoService } from "./services/video.service";
import { SharedModule } from "./shared/SharedModule.module";
import { RouterModule } from "@angular/router";
import { ConfirmationDialogComponent } from "./shared/confirmation-dialog/confirmation-dialog.component";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MetaModule,
  MetaGuard,
  MetaStaticLoader,
  MetaLoader,
  PageTitlePositioning,
} from "@ngx-meta/core";

import { FlexLayoutModule } from "@angular/flex-layout";
import { TransferHttpCacheModule } from "@nguniversal/common";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidnavComponent,
    HomeComponent,
    VideoCardComponent,
    FooterComponent,
    MobVideoCardComponent,
    CategoryViewComponent,
    PlayVideoComponent,
    ShareDialogItems,
    NextPlayVideoCardComponent,
    CatagoryVideoCardComponent,
    CommentCardComponent,
    ContactUsComponent,
    PrivacyPolicyComponent,
    LoginDialog,
    ConfirmationDialogComponent,
  ],
  imports: [
    SharedModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    SocialLoginModule,
    JwSocialButtonsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BrowserModule.withServerTransition({ appId: "serverApp" }),
    TransferHttpCacheModule,
    RouterModule.forRoot([
      {
        path: "",
        component: HomeComponent,
      },
      {
        path: "login",
        loadChildren: "./admin/admin.module#AdminModule",
      },
      {
        path: "**",
        component: HomeComponent,
      },
    ]),
    FlexLayoutModule.withConfig({ ssrObserveBreakpoints: ["xs", "lt-md"] }),
  ],
  providers: [
    sidenaveService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig,
    },
    AuthGuardUserLogin,
    StaffAuthService,
    UserAuthService,
    VideoService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [ShareDialogItems, LoginDialog, ConfirmationDialogComponent],
})
export class AppModule {}
const googleLoginOptions: LoginOpt = {
  scope: "profile email",
}; // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(
      "184679859458-jhmt1d1oet0hhcf4qcb5ir015rshgikj.apps.googleusercontent.com"
    ),
    // provider: new GoogleLoginProvider('236461318613-m608p6t0u3v67mgrggt628q3fmh4vf4i.apps.googleusercontent.com')
  },
  // {
  //   id: FacebookLoginProvider.PROVIDER_ID,
  //   provider: new FacebookLoginProvider('2313005822306799')
  // }
  // ,
  // {
  //   id: LinkedInLoginProvider.PROVIDER_ID,
  //   provider: new LinkedInLoginProvider('78iqy5cu2e1fgr')
  // }
]);

export function provideConfig() {
  return config;
}
