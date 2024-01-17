import {
  Component,
  OnInit,
  PLATFORM_ID,
  Inject,
  ViewChild,
  HostListener,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
} from "@angular/core";

import { Router } from "@angular/router";
import { JsonPipe, isPlatformBrowser } from "@angular/common";
import { Video } from "../model/video";
import { VideoService } from "../services/video.service";
import { VideoPagination } from "../model/VideoPagination";
import {
  trigger,
  transition,
  style,
  animate,
  useAnimation,
  state,
} from "@angular/animations";
import { fadeIn } from "ng-animate";
import { WINDOW } from "@ng-toolkit/universal";

import { Meta, Title } from "@angular/platform-browser";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,
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
export class HomeComponent implements OnInit {
  more1 = false;
  more2 = false;
  more3 = false;

  videos$: Video[] = [];

  // for tab mode que
  slickGoTo = 5;
  slidesToShow = 5;
  isMobile = false;
  IsElivation = false;
  width = 0;

  isBrowser;

  @ViewChild("t") elementView;
  constructor(
    @Inject(WINDOW) public window: Window,
    private meta: Meta,
    private router: Router,
    private videoService: VideoService,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getAllVideo() {
    this.videoService.getAllVideo().subscribe((res) => {
      this.videos$ = res;
    });
  }

  playVideo(id) {
    this.router.navigate(["playVideo"], { queryParams: { id: id } });
  }
  playVideoEP(id) {
    this.router.navigate(["playVideo"], { queryParams: { id: id, cat: "ep" } });
  }

  onInit: boolean = false;
  ngOnInit() {
    this.title.setTitle("Home - BethTube");

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

    this.onInit = true;
    // this.getAllVideo();

    if (this.isBrowser) {
      if (this.window.innerWidth <= 525) {
        this.isMobile = true;

        this.mob_editor_slideTo();
        // this.mob_news_slideTo();
        this.mob_drama_slideTo();
        this.mob_movie_slideTo();
        this.mob_music_slideTo();
        this.mob_comedy_slideTo();
        this.mob_tvshow_slideTo();
        this.mob_thech_slideTo();
      } else {
        // this.mob_news_video$ = [];
        // this.mob_news_hasNext = true;
        // this.mob_news_page = 1;
        this.isMobile = false;
        this.editorial_CategoryWidth();
        // this.news_CategoryWidth();
        this.drama_CategoryWidth();
        this.music_CategoryWidth();
        this.comedy_CategoryWidth();
        this.movie_CategoryWidth();
        this.tvshow_CategoryWidth();
      }
    }
  }

  @HostListener("window:resize", ["$event"])
  onresize(event) {
    if (this.isBrowser) {
      if (this.window.innerWidth <= 525) {
        this.isMobile = true;
      } else {
        // this.mob_news_video$ = [];
        // this.mob_news_hasNext = true;
        // this.mob_news_page = 1;
        this.isMobile = false;
        this.editorial_CategoryWidth();
        // this.news_CategoryWidth();
        this.drama_CategoryWidth();
        this.music_CategoryWidth();
        this.movie_CategoryWidth();
        this.comedy_CategoryWidth();
        this.tvshow_CategoryWidth();
      }
    }
  }

  /////editorial slider handler
  editorial_page = 1;
  editorial_video$: VideoPagination;
  editorial_hasNext = true;
  editorial_hasPriv = true;
  editorial_itemPerCategory = 6;
  editorial_seeMoreVideos$: Video[] = [];
  editorial_seeMoreVideosTemp$: Video[] = [];

  editorial_slideTo(page) {
    if (page <= 1) {
      page = 1;
      this.editorial_hasPriv = false;
    }
    this.videoService
      .getEditorialPike(page, this.editorial_itemPerCategory, "")
      .subscribe((res) => {
        this.editorial_video$ = res;

        this.editorial_seeMoreVideos$ = res.video;
        if (res.lastPage < page) {
          this.editorial_slideTo(res.lastPage);
        }
        this.editorial_page = this.editorial_video$.currentPage;
        if (this.editorial_video$.hasNextPage) {
          this.editorial_hasNext = true;
        } else {
          this.editorial_hasNext = false;
        }
        if (this.editorial_video$.hasPreviousPage) {
          this.editorial_hasPriv = true;
        }
      });
  }

  // CategoryWidth
  editorial_state = 0;
  editorial_CategoryWidth() {
    if (this.window.innerWidth && this.window.innerWidth > 1) {
      if (this.window.innerWidth > 1320) {
        if (this.editorial_state !== 1) {
          this.editorial_state = 1;
          this.editorial_itemPerCategory = 6;
          this.editorial_seeMoreVideos$ = [];
          this.editorial_slideTo(this.editorial_page);
          this.width = 1239;
        }
      } else if (this.window.innerWidth > 1106) {
        if (this.editorial_state !== 2) {
          this.editorial_state = 2;
          this.editorial_itemPerCategory = 5;
          this.editorial_seeMoreVideos$ = [];
          this.editorial_slideTo(this.editorial_page);
          this.width = 1020;
        }
      } else if (this.window.innerWidth > 901) {
        if (this.editorial_state !== 3) {
          this.editorial_state = 3;
          this.editorial_itemPerCategory = 4;
          this.editorial_seeMoreVideos$ = [];
          this.editorial_slideTo(this.editorial_page);
          this.width = 813;
        }
      } else if (this.window.innerWidth > 707) {
        if (this.editorial_state !== 4) {
          this.editorial_state = 4;
          this.editorial_itemPerCategory = 3;
          this.editorial_seeMoreVideos$ = [];
          this.editorial_slideTo(this.editorial_page);
          this.width = 617;
        }
      } else {
        if (this.editorial_state !== 5) {
          this.editorial_state = 5;
          this.editorial_itemPerCategory = 2;
          this.editorial_seeMoreVideos$ = [];
          this.editorial_slideTo(this.editorial_page);
          this.width = 417;
        }
      }
    } else {
    }
  }

  /////music slider handler
  music_page = 1;
  music_video$: VideoPagination;
  music_hasNext = true;
  music_hasPriv = true;
  music_itemPerCategory = 6;
  music_seeMoreVideos$: Video[] = [];
  music_seeMoreVideosTemp$: Video[] = [];

  music_slideTo(page) {
    if (page <= 1) {
      page = 1;
      this.music_hasPriv = false;
    }
    this.videoService
      .getVideoByCategory("music", page, this.music_itemPerCategory, "")
      .subscribe((res) => {
        this.music_video$ = res;
        this.music_seeMoreVideos$ = res.video;
        if (res.lastPage < page) {
          this.music_slideTo(res.lastPage);
        }
        this.music_page = this.music_video$.currentPage;
        if (this.music_video$.hasNextPage) {
          this.music_hasNext = true;
        } else {
          this.music_hasNext = false;
        }
        if (this.music_video$.hasPreviousPage) {
          this.music_hasPriv = true;
        }
      });
  }

  // CategoryWidth
  music_state = 0;
  music_CategoryWidth() {
    if (this.window.innerWidth > 1320) {
      if (this.music_state !== 1) {
        this.music_state = 1;
        this.music_itemPerCategory = 6;
        this.music_seeMoreVideos$ = [];
        this.music_slideTo(this.music_page);
        this.width = 1239;
      }
    } else if (this.window.innerWidth > 1106) {
      if (this.music_state !== 2) {
        this.music_state = 2;
        this.music_itemPerCategory = 5;
        this.music_seeMoreVideos$ = [];
        this.music_slideTo(this.music_page);
        this.width = 1020;
      }
    } else if (this.window.innerWidth > 901) {
      if (this.music_state !== 3) {
        this.music_state = 3;
        this.music_itemPerCategory = 4;
        this.music_seeMoreVideos$ = [];
        this.music_slideTo(this.music_page);
        this.width = 813;
      }
    } else if (this.window.innerWidth > 707) {
      if (this.music_state !== 4) {
        this.music_state = 4;
        this.music_itemPerCategory = 3;
        this.music_seeMoreVideos$ = [];
        this.music_slideTo(this.music_page);
        this.width = 617;
      }
    } else {
      if (this.music_state !== 5) {
        this.music_state = 5;
        this.music_itemPerCategory = 2;
        this.music_seeMoreVideos$ = [];
        this.music_slideTo(this.music_page);
        this.width = 417;
      }
    }
  }

  // end
  // end

  /////news slider handler
  // end

  /////music slider handler
  drama_page = 1;
  drama_video$: VideoPagination;
  drama_hasNext = true;
  drama_hasPriv = true;
  drama_itemPerCategory = 6;
  drama_seeMoreVideos$: Video[] = [];
  drama_seeMoreVideosTemp$: Video[] = [];

  drama_slideTo(page) {
    if (page <= 1) {
      page = 1;
      this.drama_hasPriv = false;
    }
    this.videoService
      .getVideoByCategory("drama", page, this.drama_itemPerCategory, "")
      .subscribe((res) => {
        this.drama_video$ = res;
        this.drama_seeMoreVideos$ = res.video;
        if (res.lastPage < page) {
          this.drama_slideTo(res.lastPage);
        }
        this.drama_page = this.drama_video$.currentPage;
        if (this.drama_video$.hasNextPage) {
          this.drama_hasNext = true;
        } else {
          this.drama_hasNext = false;
        }
        if (this.drama_video$.hasPreviousPage) {
          this.drama_hasPriv = true;
        }
      });
  }

  // CategoryWidth
  drama_state = 0;
  drama_CategoryWidth() {
    if (this.window.innerWidth > 1320) {
      if (this.drama_state !== 1) {
        this.drama_state = 1;
        this.drama_itemPerCategory = 6;
        this.drama_seeMoreVideos$ = [];
        this.drama_slideTo(this.drama_page);
        this.width = 1239;
      }
    } else if (this.window.innerWidth > 1106) {
      if (this.drama_state !== 2) {
        this.drama_state = 2;
        this.drama_itemPerCategory = 5;
        this.drama_seeMoreVideos$ = [];
        this.drama_slideTo(this.drama_page);
        this.width = 1020;
      }
    } else if (this.window.innerWidth > 901) {
      if (this.drama_state !== 3) {
        this.drama_state = 3;
        this.drama_itemPerCategory = 4;
        this.drama_seeMoreVideos$ = [];
        this.drama_slideTo(this.drama_page);
        this.width = 813;
      }
    } else if (this.window.innerWidth > 707) {
      if (this.drama_state !== 4) {
        this.drama_state = 4;
        this.drama_itemPerCategory = 3;
        this.drama_seeMoreVideos$ = [];
        this.drama_slideTo(this.drama_page);
        this.width = 617;
      }
    } else {
      if (this.drama_state !== 5) {
        this.drama_state = 5;
        this.drama_itemPerCategory = 2;
        this.drama_seeMoreVideos$ = [];
        this.drama_slideTo(this.drama_page);
        this.width = 417;
      }
    }
  }

  // end
  // end

  /////news slider handler
  tvshow_page = 1;
  tvshow_video$: VideoPagination;
  tvshow_hasNext = true;
  tvshow_hasPriv = true;
  tvshow_itemPerCategory = 6;
  tvshow_seeMoreVideos$: Video[] = [];
  tvshow_seeMoreVideosTemp$: Video[] = [];

  tvshow_slideTo(page) {
    if (page <= 1) {
      page = 1;
      this.tvshow_hasPriv = false;
    }
    this.videoService
      .getVideoByCategory("tvshow", page, this.tvshow_itemPerCategory, "")
      .subscribe((res) => {
        this.tvshow_video$ = res;
        this.tvshow_seeMoreVideos$ = res.video;
        if (res.lastPage < page) {
          this.tvshow_slideTo(res.lastPage);
        }
        this.tvshow_page = this.tvshow_video$.currentPage;
        if (this.tvshow_video$.hasNextPage) {
          this.tvshow_hasNext = true;
        } else {
          this.tvshow_hasNext = false;
        }
        if (this.tvshow_video$.hasPreviousPage) {
          this.tvshow_hasPriv = true;
        }
      });
  }
  // CategoryWidth
  tvshow_state = 0;
  tvshow_CategoryWidth() {
    if (this.window.innerWidth > 1320) {
      if (this.tvshow_state !== 1) {
        this.tvshow_state = 1;
        this.tvshow_itemPerCategory = 6;
        this.tvshow_seeMoreVideos$ = [];
        this.tvshow_slideTo(this.tvshow_page);
        this.width = 1239;
      }
    } else if (this.window.innerWidth > 1106) {
      if (this.tvshow_state !== 2) {
        this.tvshow_state = 2;
        this.tvshow_itemPerCategory = 5;
        this.tvshow_seeMoreVideos$ = [];
        this.tvshow_slideTo(this.tvshow_page);
        this.width = 1020;
      }
    } else if (this.window.innerWidth > 901) {
      if (this.tvshow_state !== 3) {
        this.tvshow_state = 3;
        this.tvshow_itemPerCategory = 4;
        this.tvshow_seeMoreVideos$ = [];
        this.tvshow_slideTo(this.tvshow_page);
        this.width = 813;
      }
    } else if (this.window.innerWidth > 707) {
      if (this.tvshow_state !== 4) {
        this.tvshow_state = 4;
        this.tvshow_itemPerCategory = 3;
        this.tvshow_seeMoreVideos$ = [];
        this.tvshow_slideTo(this.tvshow_page);
        this.width = 617;
      }
    } else {
      if (this.tvshow_state !== 5) {
        this.tvshow_state = 5;
        this.tvshow_itemPerCategory = 2;
        this.tvshow_seeMoreVideos$ = [];
        this.tvshow_slideTo(this.tvshow_page);
        this.width = 417;
      }
    }
  }

  // end
  // end

  /////movie slider handler
  movie_page = 1;
  movie_video$: VideoPagination;
  movie_hasNext = true;
  movie_hasPriv = true;
  movie_itemPerCategory = 6;
  movie_seeMoreVideos$: Video[] = [];
  movie_seeMoreVideosTemp$: Video[] = [];

  movie_slideTo(page) {
    if (page <= 1) {
      page = 1;
      this.movie_hasPriv = false;
    }
    this.videoService
      .getVideoByCategory("movie", page, this.movie_itemPerCategory, "")
      .subscribe((res) => {
        this.movie_video$ = res;
        this.movie_seeMoreVideos$ = res.video;
        if (res.lastPage < page) {
          this.movie_slideTo(res.lastPage);
        }
        this.movie_page = this.movie_video$.currentPage;
        if (this.movie_video$.hasNextPage) {
          this.movie_hasNext = true;
        } else {
          this.movie_hasNext = false;
        }
        if (this.movie_video$.hasPreviousPage) {
          this.movie_hasPriv = true;
        }
      });
  }
  // CategoryWidth
  movie_state = 0;
  movie_CategoryWidth() {
    if (this.window.innerWidth > 1320) {
      if (this.movie_state !== 1) {
        this.movie_state = 1;
        this.movie_itemPerCategory = 6;
        this.movie_seeMoreVideos$ = [];
        this.movie_slideTo(this.movie_page);
        this.width = 1239;
      }
    } else if (this.window.innerWidth > 1106) {
      if (this.movie_state !== 2) {
        this.movie_state = 2;
        this.movie_itemPerCategory = 5;
        this.movie_seeMoreVideos$ = [];
        this.movie_slideTo(this.movie_page);
        this.width = 1020;
      }
    } else if (this.window.innerWidth > 901) {
      if (this.movie_state !== 3) {
        this.movie_state = 3;
        this.movie_itemPerCategory = 4;
        this.movie_seeMoreVideos$ = [];
        this.movie_slideTo(this.movie_page);
        this.width = 813;
      }
    } else if (this.window.innerWidth > 707) {
      if (this.movie_state !== 4) {
        this.movie_state = 4;
        this.movie_itemPerCategory = 3;
        this.movie_seeMoreVideos$ = [];
        this.movie_slideTo(this.movie_page);
        this.width = 617;
      }
    } else {
      if (this.movie_state !== 5) {
        this.movie_state = 5;
        this.movie_itemPerCategory = 2;
        this.movie_seeMoreVideos$ = [];
        this.movie_slideTo(this.movie_page);
        this.width = 417;
      }
    }
  }

  // end
  // end

  ///// mobile news
  // end

  /////movie slider handler
  comedy_page = 1;
  comedy_video$: VideoPagination;
  comedy_hasNext = true;
  comedy_hasPriv = true;
  comedy_itemPerCategory = 6;
  comedy_seeMoreVideos$: Video[] = [];
  comedy_seeMoreVideosTemp$: Video[] = [];

  comedy_slideTo(page) {
    if (page <= 1) {
      page = 1;
      this.comedy_hasPriv = false;
    }
    this.videoService
      .getVideoByCategory("comedy", page, this.comedy_itemPerCategory, "")
      .subscribe((res) => {
        this.comedy_video$ = res;
        this.comedy_seeMoreVideos$ = res.video;
        if (res.lastPage < page) {
          this.comedy_slideTo(res.lastPage);
        }
        this.comedy_page = this.comedy_video$.currentPage;
        if (this.comedy_video$.hasNextPage) {
          this.comedy_hasNext = true;
        } else {
          this.comedy_hasNext = false;
        }
        if (this.comedy_video$.hasPreviousPage) {
          this.comedy_hasPriv = true;
        }
      });
  }
  // CategoryWidth
  comedy_state = 0;
  comedy_CategoryWidth() {
    if (this.window.innerWidth > 1320) {
      if (this.comedy_state !== 1) {
        this.comedy_state = 1;
        this.comedy_itemPerCategory = 6;
        this.comedy_seeMoreVideos$ = [];
        this.comedy_slideTo(this.comedy_page);
        this.width = 1239;
      }
    } else if (this.window.innerWidth > 1106) {
      if (this.comedy_state !== 2) {
        this.comedy_state = 2;
        this.comedy_itemPerCategory = 5;
        this.comedy_seeMoreVideos$ = [];
        this.comedy_slideTo(this.comedy_page);
        this.width = 1020;
      }
    } else if (this.window.innerWidth > 901) {
      if (this.comedy_state !== 3) {
        this.comedy_state = 3;
        this.comedy_itemPerCategory = 4;
        this.comedy_seeMoreVideos$ = [];
        this.comedy_slideTo(this.comedy_page);
        this.width = 813;
      }
    } else if (this.window.innerWidth > 707) {
      if (this.comedy_state !== 4) {
        this.comedy_state = 4;
        this.comedy_itemPerCategory = 3;
        this.comedy_seeMoreVideos$ = [];
        this.comedy_slideTo(this.comedy_page);
        this.width = 617;
      }
    } else {
      if (this.comedy_state !== 5) {
        this.comedy_state = 5;
        this.comedy_itemPerCategory = 2;
        this.comedy_seeMoreVideos$ = [];
        this.comedy_slideTo(this.comedy_page);
        this.width = 417;
      }
    }
  }

  // end
  // end

  ///// mobile news
  mob_editor_video$: Video[] = [];
  mob_editor_hasNext = true;
  mob_editor_page = 1;
  mob_editor_slideTo() {
    this.videoService
      .getEditorialPike(this.mob_editor_page, 4, "")
      .subscribe((video) => {
        this.mob_editor_page = this.mob_editor_page + 1;
        video.video.forEach((element) => {
          let isExist = false;
          this.mob_editor_video$.forEach((ele) => {
            if (ele.idvideo === element.idvideo) {
              isExist = true;
            }
          });
          if (!isExist) {
            this.mob_editor_video$.push(element);
          }
        });
        if (video.hasNextPage) {
          this.mob_editor_hasNext = true;
        } else {
          this.mob_editor_hasNext = false;
        }
      });
  }

  ///// mobile news
  mob_drama_video$: Video[] = [];
  mob_drama_hasNext = true;
  mob_drama_page = 1;
  mob_drama_slideTo() {
    this.videoService
      .getVideoByCategory("drama", this.mob_drama_page, 4, "")
      .subscribe((video) => {
        this.mob_drama_page = this.mob_drama_page + 1;
        video.video.forEach((element) => {
          let isExist = false;
          this.mob_drama_video$.forEach((ele) => {
            if (ele.idvideo === element.idvideo) {
              isExist = true;
            }
          });
          if (!isExist) {
            this.mob_drama_video$.push(element);
          }
        });
        if (video.hasNextPage) {
          this.mob_drama_hasNext = true;
        } else {
          this.mob_drama_hasNext = false;
        }
      });
  }
  ///// mobile music
  mob_music_video$: Video[] = [];
  mob_music_hasNext = true;
  mob_music_page = 1;
  mob_music_slideTo() {
    this.videoService
      .getVideoByCategory("music", this.mob_music_page, 4, "")
      .subscribe((video) => {
        this.mob_music_page = this.mob_music_page + 1;
        video.video.forEach((element) => {
          let isExist = false;
          this.mob_music_video$.forEach((ele) => {
            if (ele.idvideo === element.idvideo) {
              isExist = true;
            }
          });
          if (!isExist) {
            this.mob_music_video$.push(element);
          }
        });
        if (video.hasNextPage) {
          this.mob_music_hasNext = true;
        } else {
          this.mob_music_hasNext = false;
        }
      });
  }
  ///// mobile comedy
  mob_comedy_video$: Video[] = [];
  mob_comedy_hasNext = true;
  mob_comedy_page = 1;
  mob_comedy_slideTo() {
    this.videoService
      .getVideoByCategory("comedy", this.mob_comedy_page, 4, "")
      .subscribe((video) => {
        this.mob_comedy_page = this.mob_comedy_page + 1;
        video.video.forEach((element) => {
          let isExist = false;
          this.mob_comedy_video$.forEach((ele) => {
            if (ele.idvideo === element.idvideo) {
              isExist = true;
            }
          });
          if (!isExist) {
            this.mob_comedy_video$.push(element);
          }
        });
        if (video.hasNextPage) {
          this.mob_comedy_hasNext = true;
        } else {
          this.mob_comedy_hasNext = false;
        }
      });
  }
  ///// mobile news
  mob_movie_video$: Video[] = [];
  mob_movie_hasNext = true;
  mob_movie_page = 1;

  mob_movie_slideTo() {
    this.videoService
      .getVideoByCategory("movie", this.mob_movie_page, 4, "")
      .subscribe((video) => {
        this.mob_movie_page = this.mob_movie_page + 1;
        video.video.forEach((element) => {
          let isExist = false;
          this.mob_movie_video$.forEach((ele) => {
            if (ele.idvideo === element.idvideo) {
              isExist = true;
            }
          });
          if (!isExist) {
            this.mob_movie_video$.push(element);
          }
        });
        if (video.hasNextPage) {
          this.mob_movie_hasNext = true;
        } else {
          this.mob_movie_hasNext = false;
        }
      });
  }

  ///// mobile news
  mob_tvshow_video$: Video[] = [];
  mob_tvshow_hasNext = true;
  mob_tvshow_page = 1;
  mob_tvshow_slideTo() {
    this.videoService
      .getVideoByCategory("tvshow", this.mob_tvshow_page, 4, "")
      .subscribe((video) => {
        this.mob_tvshow_page = this.mob_tvshow_page + 1;
        video.video.forEach((element) => {
          let isExist = false;
          this.mob_tvshow_video$.forEach((ele) => {
            if (ele.idvideo === element.idvideo) {
              isExist = true;
            }
          });
          if (!isExist) {
            this.mob_tvshow_video$.push(element);
          }
        });
        if (video.hasNextPage) {
          this.mob_tvshow_hasNext = true;
        } else {
          this.mob_tvshow_hasNext = false;
        }
      });
  }

  ///// mobile news
  mob_thech_video$: Video[] = [];
  mob_thech_hasNext = true;
  mob_thech_page = 1;
  mob_thech_slideTo() {
    this.videoService
      .getVideoByCategory("technology", this.mob_thech_page, 4, "")
      .subscribe((video) => {
        this.mob_thech_page = this.mob_thech_page + 1;
        video.video.forEach((element) => {
          let isExist = false;
          this.mob_thech_video$.forEach((ele) => {
            if (ele.idvideo === element.idvideo) {
              isExist = true;
            }
          });
          if (!isExist) {
            this.mob_thech_video$.push(element);
          }
        });
        if (video.hasNextPage) {
          this.mob_thech_hasNext = true;
        } else {
          this.mob_thech_hasNext = false;
        }
      });
  }
}
