import { Component, OnInit, Input } from "@angular/core";
import { VideoService } from "../services/video.service";

@Component({
  selector: "app-mob-video-card",
  templateUrl: "./mob-video-card.component.html",
  styleUrls: ["./mob-video-card.component.css"],
})
export class MobVideoCardComponent implements OnInit {
  @Input() data: any;
  constructor(private videoService: VideoService) {}

  ngOnInit() {
    var res = this.data.url.split("/embed/");
    this.getVideoInformation(res[1]);
  }

  views$: number;

  getVideoInformation(id) {
    this.videoService.getVideoInformation(id).subscribe((info) => {
      if (info != "") {
        this.views$ = info.info.views;
      }
    });
  }
}
