import { Component, OnInit, NgZone } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  templateUrl: 'video.component.html',
  selector: 'app-video',
  styleUrls: ['video.component.scss']
})
export class VideoComponent implements OnInit {
  @Input() videoId: string;

  @Input() title: string;
  @Input() subTitle: string;
  @Input() description: string;

  private w: Number;
  private h: Number;

  constructor() {
    this.w = 150;
    this.h = 150;
  }

  width(): Number {
    return this.w;
  }

  height(): Number {
    return this.h;
  }

  ngOnInit() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }
}
