import { Component, OnInit, Input } from '@angular/core';
import { Record, RecordConverter } from 'src/app/data/Record';
import { ActivatedRoute } from '@angular/router';
import { VideoLinkService } from 'src/app/Service/video-link.service';

@Component({
  selector: 'video-detail',
  templateUrl: 'video-detail.component.html',
  styleUrls: ['video-detail.component.scss']
})
export class VideoDetail implements OnInit {
  id: string;
  record: Record;

  constructor(
    private router: ActivatedRoute,
    private videoLinkService: VideoLinkService,
  ) { }

  ngOnInit() {
    this.addScript('https://www.youtube.com/iframe_api');

    this.router.data.subscribe(
      data => this.record = data['record']
    );
  }

  private addScript(src: string) {
    const tag = document.createElement('script');
    tag.src = src;
    document.body.appendChild(tag);
  }

  getVideoHost() {
    const url = new URL(this.record.bestVideoLink);
    return this.videoLinkService.getVideoHost(url);
  }

  getVideoId() {
    const url = new URL(this.record.bestVideoLink);
    return this.videoLinkService.getVideoId(url);
  }
}
