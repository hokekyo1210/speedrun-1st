import { Component, Input } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'youtube-player',
  templateUrl: './youtube-player.component.html',
  styleUrls: ['./youtube-player.component.scss']
})
export class YoutubePlayer {
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
    this.addScript('https://www.youtube.com/iframe_api');

    const url = 'https://www.youtube.com/embed/' + this.src;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private addScript(src: string) {
    const tag = document.createElement('script');
    tag.src = src;
    document.body.appendChild(tag);
  }
}
