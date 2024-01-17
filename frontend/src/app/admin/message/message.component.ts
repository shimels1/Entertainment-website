import { Component, OnInit } from "@angular/core";
import { OtherService } from "../../services/other.service";

@Component({
  selector: "app-message",
  templateUrl: "./message.component.html",
  styleUrls: ["./message.component.css"],
})
export class MessageComponent implements OnInit {
  message$: any;
  constructor(private otherService: OtherService) {}

  ngOnInit() {
    this.otherService.getMessage(1, 10).subscribe((res: any) => {
      this.message$ = res.message;
    });
  }
}
