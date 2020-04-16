import { Component, OnInit, Input } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'niconico-player',
  templateUrl: './niconico-player.component.html',
  styleUrls: ['./niconico-player.component.scss']
})
export class NiconicoPlayer implements OnInit {
  @Input() src: string;
  safeUrl: SafeResourceUrl;
  @Input() height = '270';
  @Input() width = '480';
  @Input() frameborder = "1"
  @Input() scrolling: boolean = false;
  @Input() allowfullscreen: boolean = true;
  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const url = `https://embed.nicovideo.jp/watch/sm${this.src}/script?w=${this.width}&h=${this.height}`;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
