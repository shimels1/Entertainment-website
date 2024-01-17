import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NgForm } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class OtherService {
  // url = 'https://tesfatube.com/api/other';
  url = "http://localhost:3000/api/other";
  constructor(private _http: HttpClient) {}

  sendMessage(comment: FormData) {
    return this._http.post(this.url + "/sendMessage", comment);
  }

  getMessage(page, itemNumber) {
    return this._http.get(this.url + "/getMessage/" + page + "/" + itemNumber);
  }

  getvv() {
    return this._http.get("https://tesfatube.com/api/vv");
  }
}
