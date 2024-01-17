import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "../model/User";
import { Customer } from "../model/Customer";

@Injectable({
  providedIn: "root",
})
export class UserService {
  // url = 'https://tesfatube.com/api/user';
  url = "http://localhost:3000/api/user";
  constructor(private _http: HttpClient) {}

  getAllUser() {
    return this._http.get<User[]>(this.url + "/getAll");
  }
  getUser(email) {
    return this._http.get<Customer>(this.url + "/getuser/" + email);
  }
  getStaffUser(email) {
    return this._http.get<User>(this.url + "/getStaffUser/" + email);
  }
  addUser(data) {
    return this._http.post(this.url + "/addUser", data);
  }
  activaDiactive(email) {
    return this._http.put(this.url + "/changeStatus/" + email, {});
  }
}
