import { UserAuthService } from "../../services/userAuth.service";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import {
  AuthService,
  SocialUser,
  GoogleLoginProvider,
  FacebookLoginProvider,
  LinkedInLoginProvider,
} from "angularx-social-login";
import { User } from "../../model/User";

@Component({
  selector: "app-share-dialog",
  templateUrl: "./loginDialog.component.html",
  styleUrls: ["./loginDialog.component.css"],
})
export class LoginDialog implements OnInit {
  user: SocialUser;
  private loggedIn: boolean;
  constructor(
    public dialogRef: MatDialogRef<LoginDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private authService: AuthService,
    private userAuthService: UserAuthService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  changePosition() {
    this.dialogRef.updatePosition({ top: "555px", left: "50px" });
  }

  ngOnInit(): void {
    this.login();
  }

  mode = 0;
  login() {
    this.authService.authState.subscribe((user) => {
      if (user) {
        const uploadData = new FormData();
        uploadData.append("fname", user.firstName);
        uploadData.append("lname", user.lastName);
        uploadData.append("name", user.name);
        uploadData.append("email", user.email);
        uploadData.append("photoUrl", user.photoUrl);
        uploadData.append("provider", user.provider);
        this.userAuthService.login(uploadData).subscribe((r) => {
          this.dialogRef.close("Pizza!");
          this.signOut();
          this.mode = 0;
        });
      }
    });
  }
  clothDialog() {
    this.dialogRef.close();
  }

  signInWithGoogle(): void {
    this.mode = 1;
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }
}
interface DialogData {
  animal: string;
  name: string;
}
