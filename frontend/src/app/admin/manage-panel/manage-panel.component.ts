import { Component, OnInit } from "@angular/core";
import { StaffAuthService } from "../../services/staff-auth.service";

@Component({
  selector: "app-manage-panel",
  templateUrl: "./manage-panel.component.html",
  styleUrls: ["./manage-panel.component.css"],
})
export class ManagePanelComponent implements OnInit {
  constructor(public staffAuthService: StaffAuthService) {}

  ngOnInit() {}
}
