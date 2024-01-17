import { UserService } from "../../services/user.service";
import { User } from "../../model/User";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-view-user",
  templateUrl: "./view-user.component.html",
  styleUrls: ["./view-user.component.css"],
})
export class ViewUserComponent implements OnInit {
  displayedColumns: string[] = [
    "First Name",
    "User Name",
    "Email",
    "Phone",
    "Role",
    "Status",
    "Action",
  ];
  dataSource;

  ELEMENT_DATA$: User[] = [];
  constructor(private userService: UserService) {
    this.getUsers();
  }

  getUsers() {
    this.userService.getAllUser().subscribe((res) => {
      this.ELEMENT_DATA$ = res;
      this.dataSource = this.ELEMENT_DATA$;
    });
  }

  ngOnInit() {}

  activeDiactive(email) {
    this.userService.activaDiactive(email).subscribe((res) => {
      this.getUsers();
    });
  }
}

// const ELEMENT_DATA: User[] = [];
