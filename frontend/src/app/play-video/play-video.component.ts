import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  HostListener,
  PLATFORM_ID,
} from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { Video } from "../model/video";
import { DomSanitizer, Meta, Title } from "@angular/platform-browser";
import { VideoService } from "../services/video.service";
import { CommentService } from "../services/comment.service";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { Comment } from "../model/Comment";
import { UserAuthService } from "../services/userAuth.service";
import { LoginDialog } from "../navigation/header/loginDialog";
import { ShareDialogItems } from "./shareDialog";
import { ShareService } from "@ngx-share/core";
import { WINDOW } from "@ng-toolkit/universal";
import { isPlatformBrowser } from "@angular/common";
import { StaffAuthService } from "../services/staff-auth.service";

@Component({
  selector: "app-play-video",
  templateUrl: "./play-video.component.html",
  styleUrls: ["./play-video.component.css"],
  animations: [
    trigger("fadeIn", [
      state("in", style({ opacity: 1 })),
      transition(":enter", [style({ opacity: 0 }), animate(600)]),
    ]),
  ],
})
export class PlayVideoComponent implements OnInit, OnDestroy {
  video$: Video = {};
  downloadUrl = "";

  // for tab mode que

  isMobile = false;
  IsElivation = false;
  stg3 = 3;
  url = null;
  // end

  height = 480;

  seeMoreVideos$: Video[] = [];
  seeMoreComment$: Comment[] = [];

  seeMoreVideo = 0;
  seeMoreComment = 0;
  commentSortFilterState = "DESC";

  selectedCategory$ = "";

  showMoreCommentButton = false;
  showMoreVideoButton = false;

  currentUrl;

  isBrowser;

  constructor(
    @Inject(WINDOW) private window: Window,
    public dialog: MatDialog,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private videoService: VideoService,
    private commentService: CommentService,
    // private hostElement: ElementRef,
    public userAuthService: UserAuthService,
    public staffAuthService: StaffAuthService,
    public share: ShareService,
    private snackBar: MatSnackBar,
    private title: Title,
    private meta: Meta,
    @Inject(PLATFORM_ID) private platformId
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    // this.getCurrentPlayItemData();
  }

  isEP: boolean = false;
  tt: boolean = false;
  ngOnInit() {
    this.tt = true;

    if (this.window.innerWidth < 600) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }

    this.activatedRouter.queryParamMap.subscribe((params) => {
      this.views$ = null;
      this.likes$ = null;
      this.dislikes$ = null;
      this.youtube_dislike$ = null;
      this.youtube_like$ = null;

      this.IsUserDisLikeThisVideo$ = false;
      this.IsUserLikeThisVideo$ = false;

      const id = params["params"].id;
      const ep = params["params"].cat;
      const title = params["params"].title;
      const imageUrl = params["params"].image;

      if (!this.isBrowser) {
        this.meta.removeTag('property = "og:title"');
        this.meta.removeTag('property= "og:type"');
        this.meta.removeTag('property = "og:image"');
        this.meta.removeTag('property = "og:description"');
        this.meta.addTags([
          { property: "og:type", content: "video.movie" },
          { property: "og:title", content: title + "" },
          { property: "og:image", content: imageUrl },
          {
            property: "og:description",
            content:
              "BethTube is a reliable source for every information that matters to you all; Entertainment, News Articles, Technology, and so much more from Ethiopia &amp; beyond!",
          },
        ]);
      }

      if (this.isBrowser) {
        if (ep === "ep") {
          this.isEP = true;
        }

        if (!id) {
          this.router.navigate(["/"]);
        } else {
          var pathname = this.window.location.href;
          this.currentUrl = pathname;
          this.playVideo2(id);
          this.videoService.getVideo(id).subscribe((v) => {
            if (!this.isEP) {
              this.selectedCategory$ = v.category.toString();
            } else {
              this.selectedCategory$ = "Editorial Pick";
            }

            if (this.seeMoreVideo === 0) {
              this.showMoreVideo();
            }
            var res = v.url.split("/embed/");
            this.getVideoInformation(res[1]);
          });
        }
      }
    });

    if (this.isBrowser) {
      this.resizeVideoPlayer();
    }
  }

  views$: number = 0;
  youtube_like$: number = 0;
  youtube_dislike$: number = 0;

  getVideoInformation(id) {
    this.videoService.getVideoInformation(id).subscribe((info) => {
      if (info != "") {
        this.views$ = info.info.views;
        this.youtube_like$ = info.info.likeCount;
        this.youtube_dislike$ = info.info.dislikeCount;
      }
    });
  }

  playVideo(id) {
    if (!this.isEP) {
      this.router.navigate(["playVideo"], { queryParams: { id: id } });
    } else {
      this.router.navigate(["playVideo"], {
        queryParams: { id: id, cat: "ep" },
      });
    }
  }

  //  tab mode play que
  playVideo2(id) {
    this.videoService.getVideo(id).subscribe((video) => {
      if (!video["error"]) {
        this.video$ = video;
        if (!this.isEP) {
          this.selectedCategory$ = video.category.toString();
        } else {
          this.selectedCategory$ = "Editorial Pick";
        }

        this.title.setTitle(this.video$.title + " - BethTube");
        this.downloadUrl = this.video$.url.substr(12);
        this.downloadUrl = "https://" + "ss" + this.downloadUrl;
        this.getTrustedUrl(this.video$.url + "?rel=0;&autoplay=1&output=embed");
        this.seeMoreComment = 0;
        this.seeMoreComment$ = [];
        this.showMoreComment();
        this.getLike();
        this.numberOfComments();
        this.window.scrollTo(0, 0);
        this.refrashShowMoreVideo();
      } else {
        this.router.navigate(["/"]);
      }
    });
    this.window.scrollTo(0, 0);
  }

  getTrustedUrl(url: any) {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  //  play list actions
  c;
  commentTa: String = "";

  comment(comment) {
    var i = 1;
    this.c = comment.split(" ");
    this.c.forEach((element) => {
      if (element.length > 27) {
        this.openSnackBar("there is something wrong in your comment.", 4000);
        i = 0;
        return;
      }
    });
    if (i === 1) {
      const uploadData = new FormData();
      uploadData.append("comment", comment);
      uploadData.append("videoid", this.video$.idvideo + "");
      uploadData.append("email", this.userAuthService.getUser().email);
      this.commentService.postComment(uploadData).subscribe(
        (res) => {
          this.commentTa = "";
          this.seeMoreComment = 0;
          this.seeMoreComment$ = [];
          this.showMoreComment();
          // this.getComments(this.video$.idvideo);
          this.numberOfComments();
        },
        (err) => {
          if (err["status"] === 429) {
            this.openSnackBar(err["error"], 7000);
          }
          // console.log(err)
        }
      );
    }
  }
  openSnackBar(message: string, dur: number) {
    this.snackBar.open(message, "", {
      duration: dur,
    });
  }

  changeFilterState(filter) {
    this.commentSortFilterState = filter;
    this.seeMoreComment = 0;
    this.seeMoreComment$ = [];
    this.showMoreComment();
  }

  numberOfComments$;
  numberOfComments() {
    this.commentService
      .getCommentCount(this.video$.idvideo)
      .subscribe((res) => {
        if (res["numOfComment"]) {
          this.numberOfComments$ = res["numOfComment"];
        } else {
          this.numberOfComments$ = 0;
        }
      });
  }

  // end

  // like and dislike
  like() {
    this.videoService
      .likeVideo(this.video$.idvideo, this.userAuthService.getUser().email)
      .subscribe((res) => {
        this.getLike();
        this.getDisLike();
      });
  }
  dislike() {
    this.videoService
      .dislikeVideo(this.video$.idvideo, this.userAuthService.getUser().email)
      .subscribe((res) => {
        this.getDisLike();
        this.getLike();
      });
  }

  likes$: number = null;
  IsUserLikeThisVideo$: boolean = false;
  getLike() {
    this.videoService
      .getTotalLike(this.video$.idvideo, this.userAuthService.getUser().email)
      .subscribe((res) => {
        if (res["like"]) {
          this.likes$ = res["like"];
        } else {
          this.likes$ = 0;
        }
        if (res["userLike"]) {
          this.IsUserLikeThisVideo$ = true;
        } else {
          this.IsUserLikeThisVideo$ = false;
        }
      });
  }

  dislikes$: number = null;
  IsUserDisLikeThisVideo$ = false;
  getDisLike() {
    this.videoService
      .getTotalDisLike(
        this.video$.idvideo,
        this.userAuthService.getUser().email
      )
      .subscribe((res) => {
        if (res["like"]) {
          this.dislikes$ = res["like"];
        } else {
          this.dislikes$ = 0;
        }
        if (res["userDisLike"]) {
          this.IsUserDisLikeThisVideo$ = true;
        } else {
          this.IsUserDisLikeThisVideo$ = false;
        }
      });
  }
  // see more methode
  showMoreVideo() {
    this.seeMoreVideo = this.seeMoreVideo + 1;
    if (!this.isEP) {
      this.videoService
        .getVideoByCategory(
          this.selectedCategory$,
          this.seeMoreVideo,
          5,
          this.video$.idvideo
        )
        .subscribe((video) => {
          video.video.forEach((element) => {
            let isExist = false;
            this.seeMoreVideos$.forEach((ele) => {
              if (ele.idvideo === element.idvideo) {
                isExist = true;
              }
            });
            if (!isExist) {
              this.seeMoreVideos$.push(element);
            }
          });
          if (video.hasNextPage) {
            this.showMoreVideoButton = true;
          } else {
            this.showMoreVideoButton = false;
          }
        });
    } else {
      this.videoService
        .getEditorialPike(this.seeMoreVideo, 5, this.video$.idvideo)
        .subscribe((video) => {
          video.video.forEach((element) => {
            let isExist = false;
            this.seeMoreVideos$.forEach((ele) => {
              if (ele.idvideo === element.idvideo) {
                isExist = true;
              }
            });
            if (!isExist) {
              this.seeMoreVideos$.push(element);
            }
          });
          if (video.hasNextPage) {
            this.showMoreVideoButton = true;
          } else {
            this.showMoreVideoButton = false;
          }
        });
    }
  }

  // refrash show more videos
  refrashShowMoreVideo() {
    let i = 0;
    this.seeMoreVideos$.forEach((element) => {
      if (element.idvideo === this.video$.idvideo) {
        this.seeMoreVideos$.splice(i, 1);
        this.showMoreVideo2();
      }
      i++;
    });
  }

  // see more methode
  showMoreVideo2() {
    let isPicked = false;

    if (!this.isEP) {
      this.videoService
        .getVideoByCategory(
          this.selectedCategory$,
          this.seeMoreVideo + 1,
          5,
          this.video$.idvideo
        )
        .subscribe((video) => {
          let i = 0;
          let i2 = video.video.length;
          video.video.forEach((element) => {
            let isExist = false;

            this.seeMoreVideos$.forEach((ele) => {
              if (ele.idvideo === element.idvideo) {
                isExist = true;
              }
            });

            if (!isExist && !isPicked) {
              this.seeMoreVideos$.push(element);
              if (i + 1 === video.video.length) {
                this.seeMoreVideo = this.seeMoreVideo + 1;
              }
              isPicked = true;
            }
            i = i + 1;
          });
        });
    } else {
      this.videoService
        .getEditorialPike(this.seeMoreVideo + 1, 5, this.video$.idvideo)
        .subscribe((video) => {
          let i = 0;
          let i2 = video.video.length;
          video.video.forEach((element) => {
            let isExist = false;

            this.seeMoreVideos$.forEach((ele) => {
              if (ele.idvideo === element.idvideo) {
                isExist = true;
              }
            });

            if (!isExist && !isPicked) {
              this.seeMoreVideos$.push(element);
              if (i + 1 === video.video.length) {
                this.seeMoreVideo = this.seeMoreVideo + 1;
              }
              isPicked = true;
            }
            i = i + 1;
          });
        });
    }
  }

  showMoreComment() {
    this.seeMoreComment = this.seeMoreComment + 1;
    this.commentService
      .getAllComment(
        this.video$.idvideo,
        this.commentSortFilterState,
        this.seeMoreComment,
        4
      )
      .subscribe((comment) => {
        if (!comment["message"]) {
          comment.comment.forEach((element) => {
            this.seeMoreComment$.push(element);
          });
        }
        if (comment.hasNextPage) {
          this.showMoreCommentButton = true;
        } else {
          this.showMoreCommentButton = false;
        }
      });
  }

  @HostListener("window:resize", ["$event"])
  onresize(event) {
    this.resizeVideoPlayer();
    if (this.window.innerWidth < 600) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  ngOnDestroy(): void {}

  commentIsInAction = false;
  onFocus(c) {
    this.commentIsInAction = true;
  }
  onBlurMethod() {
    this.commentIsInAction = false;
  }

  resizeVideoPlayer() {
    if (this.window.innerWidth <= 400) {
      this.height = 210;
    } else if (this.window.innerWidth <= 560) {
      this.height = 300;
    } else if (this.window.innerWidth <= 650) {
      this.height = 350;
    } else if (this.window.innerWidth <= 720) {
      this.height = 390;
    } else if (this.window.innerWidth <= 750) {
      this.height = 420;
    } else if (
      this.window.innerWidth >= 960 &&
      this.window.innerWidth <= 1050
    ) {
      this.height = 360;
    } else if (
      this.window.innerWidth >= 960 &&
      this.window.innerWidth <= 1144
    ) {
      this.height = 400;
    } else if (
      this.window.innerWidth >= 960 &&
      this.window.innerWidth <= 1230
    ) {
      this.height = 440;
    } else {
      this.height = 480;
    }
  }

  // end

  // share dialog
  animal: string = "Ff";
  name: string = "Ff";
  shareDialog(): void {
    const dialogRef = this.dialog.open(ShareDialogItems, {
      width: "300px",
      data: { name: this.name, animal: this.animal },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.animal = result;
    });
  }
  // end

  // logon dialog
  LoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialog, {
      // width: '350px',
      // height: '300px',
      panelClass: "my-login-dialog",
      data: { name: this.name, animal: this.animal },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.animal = result;
    });
  }
  // end

  fbShare(url, title, descr, image, winWidth, winHeight) {
    var winTop = screen.height / 2 - winHeight / 2;
    var winLeft = screen.width / 2 - winWidth / 2;
    window.open(
      "http://www.facebook.com/sharer.php?s=100&p[title]=" +
        title +
        "&p[summary]=" +
        descr +
        "&p[url]=" +
        url +
        "&p[images][0]=" +
        image,
      "sharer",
      "top=" +
        winTop +
        ",left=" +
        winLeft +
        ",toolbar=0,status=0,width=" +
        winWidth +
        ",height=" +
        winHeight
    );
  }

  ///////update discription
  c2;
  disc_update: String = "";
  isUpdateReady = false;

  updateDisc(disc) {
    var i = 1;
    this.c2 = disc.split(" ");
    this.c2.forEach((element) => {
      if (element.length > 27) {
        this.openSnackBar(
          "there is something wrong in your discription.",
          4000
        );
        i = 0;
        return;
      }
    });
    if (i === 1) {
      const uploadData = new FormData();
      uploadData.append("discription", disc);
      uploadData.append("vid", this.video$.idvideo + "");
      this.videoService.updateVideoDiscription(uploadData).subscribe(
        (res) => {
          this.video$.discription = disc;
          this.isUpdateReady = false;
          this.openSnackBar("update success", 2000);
        },
        (err) => {
          if (err["status"] === 429) {
            this.openSnackBar(err["error"], 7000);
          }
        }
      );
    }
  }
}
