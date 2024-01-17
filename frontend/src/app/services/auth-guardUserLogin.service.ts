import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { UserAuthService } from "./userAuth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuardUserLogin implements CanActivate {
  constructor(private authService: UserAuthService, private router: Router) {}

  canActivate() {
    if (this.authService.isLogedIn()) return true;
    this.router.navigate["/"];
    return false;
  }
}
