import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Video } from '../model/video';
import { VideoService } from '../services/video.service';

@Component({
  selector: 'app-next-play-video-card',
  templateUrl: './next-play-video-card.component.html',
  styleUrls: ['./next-play-video-card.component.css']
})
export class NextPlayVideoCardComponent implements OnInit {
  @Input() data: any;
  constructor(private router: Router, private videoService: VideoService) {

  }

  ngOnInit() {
    var res = this.data.url.split('/embed/');
    this.getVideoInformation(res[1]);
  }


  views$: number;
  // youtube_like$: number = 0;
  // youtube_dislike$: number = 0;

  getVideoInformation(id) {
    this.videoService.getVideoInformation(id).subscribe(info => {
      if (info != '') {
        this.views$ = info.info.views;
        // this.youtube_like$ = info.info.likeCount;
        // this.youtube_dislike$ = info.info.dislikeCount;
      }
    });
  }
}
