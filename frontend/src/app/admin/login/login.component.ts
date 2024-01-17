import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { StaffAuthService } from "../../services/staff-auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  error$: String = "";

  constructor(private staffAuthService: StaffAuthService) {}

  ngOnInit() {}

  login(form: NgForm) {
    const uploadData = new FormData();
    uploadData.append("email", form.value.email);
    uploadData.append("password", form.value.password);
    this.staffAuthService.login(uploadData).subscribe((res) => {
      if (res == false) {
        this.error$ = "User name or password is not correct.";
      }
    });
  }
}
