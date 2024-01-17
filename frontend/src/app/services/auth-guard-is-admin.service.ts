import { Injectable } from "@angular/core";
import { StaffAuthService } from "./staff-auth.service";
import { CanActivate, Router } from "@angular/router";
import { routerNgProbeToken } from "@angular/router/src/router_module";

@Injectable({
  providedIn: "root",
})
export class AuthGuardIsAdmin implements CanActivate {
  constructor(
    private staffAuthService: StaffAuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.staffAuthService.isAdmin()) {
      return true;
    }
    this.router.navigate(["/"]);
    return false;
  }
}
