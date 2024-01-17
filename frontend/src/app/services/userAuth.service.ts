import { Injectable, Inject } from '@angular/core';
import { User } from '../model/User';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private user: User;
  authChange = new Subject<boolean>();
  // url = 'https://tesfatube.com/api/auth';
  url = 'http://localhost:3000/api/auth';

  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, private router: Router, private _http: HttpClient) { }

  // register(user: User) {
  //   this.user = user;
  //   this.authSuccess();
  // }

  login(user: FormData) {
    return this._http.post(this.url + '/login', user).pipe(map(res => {
      if (res && res['token']) {
        this.localStorage.removeItem('stoken');
        this.localStorage.setItem('token', res['token'])
        return true;
      } else {
        return false;
      }
    }));
  }

  getUser() {
    const token = this.localStorage.getItem('token');
    if (!token) { return false; }
    return  new JwtHelperService().decodeToken(token);
  }

  logout() {
    this.localStorage.removeItem('token');
  }

  isLogedIn() {
    const token = this.localStorage.getItem('token');
    if (!token) { return false; }
    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(token);
    return !isExpired;
  }

  // authSuccess() {
  //   this.router.navigate(['/traning']);
  //   this.authChange.next(true);
  // }
}
