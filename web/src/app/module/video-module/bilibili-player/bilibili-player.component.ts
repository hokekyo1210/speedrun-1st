import { Component, OnInit, Input } from '@angular/core';
import { SafeResourceUrl, DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'bilibili-player',
  templateUrl: './bilibili-player.component.html',
  styleUrls: ['./bilibili-player.component.scss']
})
export class BilibiliPlayer implements OnInit {
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
    // cid=120163952&
    const url = "//player.bilibili.com/player.html?page=1&aid=" + this.src;
    console.log(url);
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
