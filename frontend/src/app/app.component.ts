import {
  Component,
  ViewChild,
  HostListener,
  OnDestroy,
  Inject,
} from "@angular/core";
import { MatSidenav, MatDialog } from "@angular/material";
import { PlayVideoComponent } from "./play-video/play-video.component";
import { sidenaveService } from "./services/sidenavService";
import { Subscription } from "rxjs";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { WINDOW } from "@ng-toolkit/universal";
// import { stat } from 'fs';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  animations: [
    trigger("fadeIn", [
      // the "in" style determines the "resting" state of the element when it is visible.
      state("in", style({ opacity: 1 })),

      // fade in when created. this could also be written as transition('void => *')
      transition(":enter", [style({ opacity: 0 }), animate(600)]),

      // fade out when destroyed. this could also be written as transition('void => *')
      // transition(':leave',
      //   animate(600, style({opacity: 0}))
      //   )
    ]),
  ],
})
export class AppComponent implements OnDestroy {
  sidenaveMode = "over";
  sidenavOpened;
  subscription = new Subscription();

  @ViewChild("sidenav")
  sidenav: MatSidenav;
  @HostListener("window:resize", ["$event"])
  onresize(event) {
    // if (event.target.innerWidth <= 1279) {
    //   this.sidenav.close();
    //   this.sidenaveMode = "over";
    // }
    // else {
    //   this.sidenav.open();
    //   this.sidenaveMode = "side";
    // }
  }
  constructor(
    @Inject(WINDOW) private window: Window,
    private sidenaveService: sidenaveService,
    public dialog: MatDialog
  ) {
    this.subscription = this.sidenaveService.getMessage().subscribe((r) => {
      // if(r==true)
      // return this.sidenav.open();
      // this.sidenav.close();
    });
  }

  ngOnInit() {
    // if (window.innerWidth <= 1279) {
    //   this.sidenaveMode = "over";
    //   this.sidenavOpened = false;
    // }
    // else {
    //   this.sidenaveMode = "side";
    //   this.sidenavOpened = true;
    // }
  }
  onActivate(event) {
    // window.scroll(0,0);
    //  document.body.scrollTop = 0;
    //  document.querySelector('body').scrollTo(0,0)
    //  console.log("D")
    // let top = document.getElementById('top');
    // if (top !== null) {
    //   top.scrollIntoView();
    //   top = null;
    //   console.log("Dsd");
    // }
    // console.log("f")
    // let top = document.getElementById('top');
    // if (top !== null) {
    //   top.scrollIntoView();
    //   top = null;
    // }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
