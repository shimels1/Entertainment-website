import { Component, OnInit, Input } from "@angular/core";
import {
  MatSlideToggleChange,
  MatDialog,
  MatSnackBar,
} from "@angular/material";
import { VideoService } from "../../services/video.service";
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from "../../services/user.service";
import { User } from "../../model/User";
import { ConfirmationDialogComponent } from "../../shared/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "app-manage-video-item-card",
  templateUrl: "./manage-video-item-card.component.html",
  styleUrls: ["./manage-video-item-card.component.css"],
})
export class ManageVideoItemCardComponent implements OnInit {
  @Input() data: any;

  checked;
  color = "#ffc400";
  user$: User = {};
  constructor(
    private videoService: VideoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public userService: UserService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  public toggle(event: MatSlideToggleChange) {
    this.videoService.activaDiactive(this.data["idvideo"]).subscribe((res) => {
      if (res["message"] === "video is activated") {
        this.data["status"] = "ON";
      } else {
        this.data["status"] = "OFF";
      }
    });
  }
  public editorialPickSwitcher() {
    this.videoService
      .editorialPickSwitcher(this.data["idvideo"])
      .subscribe((res) => {
        this.data["isEditorialPick"] = res["message"];
      });
  }
  public deleteVideo() {
    this.videoService.deleteVideo(this.data["idvideo"]).subscribe((res) => {
      this.openSnackBar("deleted success, refresh the page please", 4000);
    });
  }
  openSnackBar(message: string, dur: number) {
    this.snackBar.open(message, "", {
      duration: dur,
    });
  }

  ngOnInit() {
    this.userService.getStaffUser(this.data.uid).subscribe((res) => {
      this.user$ = res;
    });
  }
  playVideo(id) {
    this.router.navigate(["/playVideo"], { queryParams: { id: id } });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "350px",
      data: "Do you confirm the deletion of this data?",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("Yes clicked");
        // DO SOMETHING
        this.deleteVideo();
      }
    });
  }
}
