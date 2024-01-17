import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  HostListener,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID,
} from "@angular/core";
import { LoginDialog } from "./loginDialog";
import { MatDialog } from "@angular/material";
import { UserAuthService } from "../../services/userAuth.service";
import { StaffAuthService } from "../../services/staff-auth.service";
import { WINDOW } from "@ng-toolkit/universal";
import { isPlatformBrowser } from "@angular/common";
import { OtherService } from "../../services/other.service";

@Component({
  selector: "app2-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  width = 0;

  isAuth = false;
  menu = true;

  isMobile = false;
  isBrowser;
  constructor(
    @Inject(WINDOW) public window: Window,
    public dialog: MatDialog,
    public authService: UserAuthService,
    private otherServ: OtherService,
    public staffAuthService: StaffAuthService,
    @Inject(PLATFORM_ID) private platformId
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.window.innerWidth < 680) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    if (this.isBrowser) {
      this.otherServ.getvv().subscribe((res) => {});
    }
  }

  menuOnClick() {
    this.sidenavToggle.emit();
  }

  @HostListener("window:resize", ["$event"])
  onresize(event) {
    this.width = event.target.innerWidth;
    if (this.window.innerWidth < 680) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  // share dialog
  animal: string = "Ff";
  name: string = "Ff";
  LoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialog, {
      width: "250px",
      height: "250px",
      panelClass: "my-login-dialog",
      data: { name: this.name, animal: this.animal },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.animal = result;
    });
  }
  // end
}
