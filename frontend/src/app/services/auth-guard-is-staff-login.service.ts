import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { StaffAuthService } from "./staff-auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuardIsStaffLogin implements CanActivate {
  constructor(private staffService: StaffAuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.staffService.isLogedIn()) {
      return true;
    }
    this.router.navigate([""]);
    return false;
  }
}
