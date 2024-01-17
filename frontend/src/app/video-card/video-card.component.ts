import { Component, OnInit, Input } from "@angular/core";
import { ViewEncapsulation } from "@angular/compiler/src/core";
import { VideoService } from "../services/video.service";

@Component({
  selector: "app-video-card",
  templateUrl: "./video-card.component.html",
  styleUrls: ["./video-card.component.css"],
})
export class VideoCardComponent implements OnInit {
  @Input() data: any;
  constructor(private videoService: VideoService) {}

  ngOnInit() {
    var res = this.data.url.split("/embed/");
    this.getVideoInformation(res[1]);
  }

  views$: number = 0;
  // youtube_like$: number = 0;
  // youtube_dislike$: number = 0;

  getVideoInformation(id) {
    this.videoService.getVideoInformation(id).subscribe((info) => {
      if (info != "") {
        this.views$ = info.info.views;
        // this.youtube_like$ = info.info.likeCount;
        // this.youtube_dislike$ = info.info.dislikeCount;
      }
    });
  }
}
