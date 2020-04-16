import { Component, OnInit, Input } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'twitch-player',
  templateUrl: 'twitch-player.component.html',
  styleUrls: ['twitch-player.component.scss']
})
export class TwitchPlayer implements OnInit {
  @Input() src: string;
  safeUrl: SafeResourceUrl;
  @Input() height = '270';
  @Input() width = '480';
  @Input() frameborder = "1"
  @Input() scrolling: boolean = false;
  @Input() allowfullscreen: boolean = true;

  constructor(
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const url = new URL('https://player.twitch.tv/');
    url.searchParams.set('video', this.src);
    url.searchParams.set('autoplay', 'false');

    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url.href);
  }

}
