import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MessageComponent } from "./message/message.component";
import { AddUserComponent } from "./add-user/add-user.component";
import { LoginComponent } from "./login/login.component";
import { ManagePanelComponent } from "./manage-panel/manage-panel.component";
import { AddVideoComponent } from "./add-video/add-video.component";
import { ViewUserComponent } from "./view-user/view-user.component";
import { ViewVideoListComponent } from "./view-video-list/view-video-list.component";
import { ManagmentComponent } from "./managment/managment.component";
import { ManageVideoItemCardComponent } from "./manage-video-item-card/manage-video-item-card.component";
import { AuthGuardIsAdmin } from "../services/auth-guard-is-admin.service";
import { AuthGuardIsStaffLogin } from "../services/auth-guard-is-staff-login.service";
import { SharedModule } from "../shared/SharedModule.module";
import { MatTableModule } from "@angular/material";
// import { ShareButtonsModule } from '@ngx-share/buttons';

@NgModule({
  declarations: [
    MessageComponent,
    AddUserComponent,
    AddVideoComponent,
    LoginComponent,
    ManagePanelComponent,
    ManagmentComponent,
    ViewUserComponent,
    ViewVideoListComponent,
    ManageVideoItemCardComponent,
    //  ShareButtonsModule
  ],
  imports: [
    SharedModule,
    MatTableModule,
    RouterModule.forChild([
      {
        path: "",
        children: [
          { path: "", component: LoginComponent },
          {
            path: "users",
            component: ViewUserComponent,
            canActivate: [AuthGuardIsAdmin],
          },
          {
            path: "addUser",
            component: AddUserComponent,
            canActivate: [AuthGuardIsAdmin],
          },
          {
            path: "message",
            component: MessageComponent,
            canActivate: [AuthGuardIsAdmin],
          },
          {
            path: "manageVideoList",
            component: ViewVideoListComponent,
            canActivate: [AuthGuardIsStaffLogin],
          },
          {
            path: "addVideo",
            component: AddVideoComponent,
            canActivate: [AuthGuardIsStaffLogin],
          },
        ],
      },
    ]),
  ],
  providers: [
    // AdminAuthGurdServic
  ],
  entryComponents: [],
  exports: [RouterModule],
})
export class AdminModule {}
