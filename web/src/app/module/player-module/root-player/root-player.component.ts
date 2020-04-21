import { Component, OnInit, Input } from '@angular/core';
import { VideoLinkService, VideoHost } from 'src/app/Service/video-link.service';

@Component({
  selector: 'root-player',
  templateUrl: './root-player.component.html',
  styleUrls: ['./root-player.component.scss']
})
export class RootPlayer implements OnInit {
  @Input() bestVideoLink: string;
  private url: URL;

  constructor(
    private videoLinkService: VideoLinkService
  ) { }

  ngOnInit(): void {
    try {
      this.url = new URL(this.bestVideoLink);
    } catch (error) {
      // ビデオリンクのパースに失敗
      this.url = null;
    }
  }

  getVideoHost(): VideoHost {
    return this.videoLinkService.getVideoHost(this.url);
  }

  getVideoId() {
    return this.videoLinkService.getVideoId(this.url);
  }

  getDefaultThumbnail() {
    return this.videoLinkService.getDefaultThumbnailUrl(this.url);
  }
}
