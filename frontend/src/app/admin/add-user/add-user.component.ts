import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.css"],
})
export class AddUserComponent implements OnInit {
  roles: Role[] = [
    { value: "author", viewValue: "Author" },
    { value: "admin", viewValue: "Admin" },
  ];
  error$: String = "";
  success$: String = "";
  constructor(private userService: UserService) {}

  ngOnInit() {}
  addUser(form: NgForm) {
    // console.log(form.value)
    const formData = new FormData();
    formData.append("email", form.value.email);
    formData.append("fname", form.value.fname);
    formData.append("lname", form.value.lname);
    formData.append("password", form.value.password);
    formData.append("phone", form.value.phone);
    formData.append("role", form.value.role);
    formData.append("userName", form.value.userName);
    this.userService.addUser(formData).subscribe((res) => {
      if (res["message"] == "true") {
        this.success$ = "User Added success.";
        this.error$ = "";
        form.resetForm();
      } else {
        this.error$ = res["message"];
        this.success$ = "";
      }
    });
  }
}
export interface Role {
  value: string;
  viewValue: string;
}
