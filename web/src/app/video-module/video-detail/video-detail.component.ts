import { Component, OnInit } from '@angular/core';
import { Record } from 'src/app/data/Record';
import { ActivatedRoute } from '@angular/router';
import { VideoLinkService } from 'src/app/Service/video-link.service';
import { Location } from '@angular/common';

@Component({
  selector: 'video-detail',
  templateUrl: 'video-detail.component.html',
  styleUrls: ['video-detail.component.scss']
})
export class VideoDetail implements OnInit {
  record: Record;

  constructor(
    private router: ActivatedRoute,
    private location: Location,
    private videoLinkService: VideoLinkService,
  ) { }

  ngOnInit() {
    this.router.data.subscribe(
      data => this.record = data['record']
    );
  }


  getVideoHost() {
    const url = new URL(this.record.bestVideoLink);
    return this.videoLinkService.getVideoHost(url);
  }

  getVideoId() {
    const url = new URL(this.record.bestVideoLink);
    return this.videoLinkService.getVideoId(url);
  }

  goBack() {
    this.location.back();
  }
}
