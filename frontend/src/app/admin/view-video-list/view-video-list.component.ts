import { Component, OnInit, Inject } from "@angular/core";
import { VideoService } from "../../services/video.service";
import { Video } from "../../model/video";
import { VideoPagination } from "../../model/VideoPagination";
import { Router, ActivatedRoute } from "@angular/router";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { WINDOW } from "@ng-toolkit/universal";

@Component({
  selector: "app-view-video-list",
  templateUrl: "./view-video-list.component.html",
  styleUrls: ["./view-video-list.component.css"],
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
export class ViewVideoListComponent implements OnInit {
  category: String = "";
  page: number = 1;
  video$: VideoPagination = {};
  constructor(
    @Inject(WINDOW) private window: Window,
    private videoService: VideoService
  ) {
    // this.page = params['params']['page'];
    // videoService.AdmingetAllVideo(this.page,10).subscribe(res => {
    //       //  this.$video = video;
    //     window.scrollTo(0, 350)
    // })
  }

  ngOnInit() {
    // this.activatedRoute.queryParamMap.subscribe(params => {
    //   this.category = params['params']['category'];
    //   this.page = params['params']['page'];
    //   this.videoService.AdmingetAllVideo(this.page,10).subscribe(video => {
    //     this.video$ = video;
    //     console.log(video,this.video$)
    //     window.scrollTo(0, 0)
    //   });
    // });
    this.gotoPage(1);
  }

  pages(n: number): any[] {
    return Array(n);
  }

  gotoPage(page) {
    this.videoService.AdmingetAllVideo(page, 10).subscribe((video) => {
      this.video$ = video;
      this.window.scrollTo(0, 0);
    });
  }
}
