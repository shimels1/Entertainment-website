import { Injectable, Inject } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Staff } from "../model/staff.model";
import { LOCAL_STORAGE } from "@ng-toolkit/universal";

@Injectable({
  providedIn: "root",
})
export class StaffAuthService {
  private staff: Staff;
  authChange = new Subject<boolean>();
  // url = 'https://tesfatube.com/api/auth';
  url = "http://localhost:3000/api/auth";

  constructor(
    @Inject(LOCAL_STORAGE) private localStorage: any,
    private router: Router,
    private _http: HttpClient
  ) {}

  login(user: FormData) {
    return this._http.post(this.url + "/staffLogin", user).pipe(
      map((res) => {
        if (res && res["token"]) {
          this.localStorage.removeItem("token");
          this.localStorage.setItem("stoken", res["token"]);
          this.router.navigate(["/login/manageVideoList"]);
          return true;
        } else {
          return false;
        }
      })
    );
  }

  getUser() {
    const token = this.localStorage.getItem("stoken");
    if (!token) {
      return false;
    }
    return new JwtHelperService().decodeToken(token);
  }

  isAdmin() {
    const token = this.localStorage.getItem("stoken");
    if (!token) {
      return false;
    }
    const user = new JwtHelperService().decodeToken(token);
    if (user["role"] === "admin") {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.localStorage.removeItem("stoken");
    this.router.navigate([""]);
  }

  isLogedIn() {
    const token = this.localStorage.getItem("stoken");
    if (!token) {
      return false;
    }
    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(token);
    return !isExpired;
  }
}
