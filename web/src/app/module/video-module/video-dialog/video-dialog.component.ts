import { Component, Inject } from '@angular/core';
import { OnInit, OnDestroy } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Record } from './../../../data/Record'
import { VideoLinkService } from 'src/app/Service/video-link.service';


@Component({
  selector: 'dialog-video',
  templateUrl: 'video-dialog.component.html'
})
export class DialogVideo implements OnInit, OnDestroy {

  constructor(
    @Inject(MAT_DIALOG_DATA) public record: Record,
    private matDialogRef : MatDialogRef<DialogVideo>,
    private videoLinkService :VideoLinkService,
  ) { }

  ngOnInit() {
    this.addScript('https://www.youtube.com/iframe_api');
  }

  private addScript(src: string) {
    const tag = document.createElement('script');
    tag.src = src;
    document.body.appendChild(tag);
  }

  ngOnDestroy() {
  }

  onNoClick(): void {
    this.matDialogRef.close();
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
