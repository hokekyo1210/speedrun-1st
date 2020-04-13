import { Component, OnInit, Input } from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'twitch-player',
  templateUrl: 'twitch-player.component.html'
})
export class TwitchPlayer implements OnInit {
  @Input() src: string;
  @Input() height: number = 270;
  @Input() width: number = 480;
  @Input() frameborder = "1"
  @Input() scrolling: boolean = false;
  @Input() allowfullscreen: boolean = true;

  constructor(
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {}

  getSrcUrl() {
    const url = new URL('https://player.twitch.tv/');
    url.searchParams.set('video', this.src);
    url.searchParams.set('autoplay', 'false');

    return this.sanitizer.bypassSecurityTrustResourceUrl(url.href);
  }
}
