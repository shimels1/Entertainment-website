import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  Inject,
  PLATFORM_ID,
} from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { VideoService } from "../services/video.service";
import { Video } from "../model/video";
import { VideoPagination } from "../model/VideoPagination";
import { MatButtonToggleGroup } from "@angular/material";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { WINDOW } from "@ng-toolkit/universal";

import { Meta, Title } from "@angular/platform-browser";
import { isPlatformBrowser, TitleCasePipe } from "@angular/common";
import { pipe } from "@angular/core/src/render3";
@Component({
  selector: "app-category-view",
  templateUrl: "./category-view.component.html",
  styleUrls: ["./category-view.component.css"],
  animations: [
    trigger("fadeIn", [
      // the 'in' style determines the 'resting' state of the element when it is visible.
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
export class CategoryViewComponent implements OnInit {
  IsElivation = false;
  navigationSubscription;
  // variables
  category: string = "";
  page: number = 1;
  $video: VideoPagination = {};

  isMobile = false;

  numberOfVideos: number;

  seeMore = 0;
  seeMoreVideos$: Video[] = [];
  showMoreVideoButton = false;

  @ViewChild(MatButtonToggleGroup)
  public toggleGroup: MatButtonToggleGroup;
  // end
  isBrowser;
  @ViewChild("t") elementView;
  constructor(
    @Inject(WINDOW) private window: Window,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private videoService: VideoService,
    private meta: Meta,
    @Inject(PLATFORM_ID) private platformId,
    private title: Title
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.showMore();
  }
  onInt = false;
  onReady = false;

  ngOnInit() {
    this.meta.removeTag('property = "og:title"');
    this.meta.removeTag('property= "og:type"');
    this.meta.removeTag('property = "og:image"');
    this.meta.removeTag('property = "og:description"');

    this.meta.addTags([
      {
        property: "og:title",
        content: "BethTube - Ethiopian entertainment website",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content: "http://i3.ytimg.com/vi/MRlaU3um2KI/maxresdefault.jpg",
      },
      {
        property: "og:description",
        content:
          "BethTube is a reliable source for every information that matters to you all; Entertainment, News Articles, Technology, and so much more from Ethiopia &amp; beyond!",
      },
    ]);

    if (this.isBrowser) {
      this.onInt = true;

      this.activatedRoute.queryParamMap.subscribe((params) => {
        this.window.scrollTo(0, 0);
        this.category = params["params"]["category"];

        this.title.setTitle(this.category.toUpperCase() + " - BethTube");
        this.page = params["params"]["page"];
        if (this.category !== "editorial") {
          this.videoService
            .getVideoByCategory(this.category, this.page, 9, "")
            .subscribe((video) => {
              this.onReady = true;
              this.$video = video;
              this.videoService
                .countCatagoryVideos(this.category)
                .subscribe((res) => {
                  this.numberOfVideos = res["result"];
                });
            });
        } else {
          this.videoService
            .getEditorialPike(this.page, 9, "")
            .subscribe((video) => {
              this.$video = video;
              this.onReady = true;
              this.videoService.countCatagoryVideosEP().subscribe((res) => {
                this.numberOfVideos = res["result"];
              });
            });
        }
      });
      if (this.window.innerWidth <= 525) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    }
  }
  @HostListener("window:resize", ["$event"])
  onresize(event) {
    if (this.window.innerWidth <= 525) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    this.getJustifyContenetStyle();
  }

  getJustifyContenetStyle() {
    if (!this.isMobile) {
      return "center";
    } else {
      return "space-between";
    }
  }

  playVideo(id) {
    if (this.category !== "editorial") {
      this.router.navigate(["/playVideo"], { queryParams: { id: id } });
    } else {
      this.router.navigate(["playVideo"], {
        queryParams: { id: id, cat: "ep" },
      });
    }
  }

  goToPage(category, page) {
    if (this.category !== "editorial") {
      this.videoService
        .getVideoByCategory(category, page, 9, "")
        .subscribe((video) => {
          this.$video = video;
          if (!this.isMobile) {
            this.window.scrollTo(0, 0);
          } else {
            this.window.scrollTo(0, 0);
          }
        });
    } else {
      this.videoService.getEditorialPike(page, 9, "").subscribe((video) => {
        this.$video = video;
        if (!this.isMobile) {
          this.window.scrollTo(0, 0);
        } else {
          this.window.scrollTo(0, 0);
        }
      });
    }
  }

  // show more method

  showMore() {
    this.seeMore = this.seeMore + 1;

    if (this.category !== "editorial") {
      this.videoService
        .getVideoByCategory("music", this.seeMore, 4, "")
        .subscribe((video) => {
          video.video.forEach((element) => {
            this.seeMoreVideos$.push(element);
          });
          if (video.hasNextPage) {
            this.showMoreVideoButton = true;
          } else {
            this.showMoreVideoButton = false;
          }
        });
    } else {
      this.videoService
        .getVideoByCategory("music", this.seeMore, 4, "")
        .subscribe((video) => {
          video.video.forEach((element) => {
            this.seeMoreVideos$.push(element);
          });
          if (video.hasNextPage) {
            this.showMoreVideoButton = true;
          } else {
            this.showMoreVideoButton = false;
          }
        });
    }
  }

  ngOnDestroy() {}

  pages(n: number): any[] {
    return Array(n);
  }

  doReset() {
    this.toggleGroup.selected;
  }
}
