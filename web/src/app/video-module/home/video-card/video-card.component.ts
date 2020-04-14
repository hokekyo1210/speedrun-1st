import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogVideo } from '../../video-dialog/video-dialog.component';

import { Record } from '../../../data/Record'
import { VideoLinkService } from 'src/app/Service/video-link.service';

@Component({
  selector: 'video-card',
  templateUrl: 'video-card.component.html',
  styleUrls: ['video-card.component.scss'],
})
export class VideoCardComponent implements OnInit {
  @Input() record: Record;

  imgSrc: string;
  defaultImgSrc: string;

  constructor(
    public dialog: MatDialog,
    private videoLinkService: VideoLinkService
  ) { }

  ngOnInit() {
    this.setupImgSrc();
  }

  private setupImgSrc() {
    if(this.record.bestVideoLink != "") {
      const url = new URL(this.record.bestVideoLink);
      this.imgSrc = this.videoLinkService.getThumbnailUrl(url);
      this.defaultImgSrc = this.videoLinkService.getDefaultThmbnailUrl(url);
    } else {
      this.imgSrc = this.videoLinkService.getDefaultThmbnailUrl(null);
    }
  }

  /**
   * Open Youtube Dialog
   */
  openVideo() {
    const dialogRef = this.dialog.open(DialogVideo, {
			height : '80%',
      width : '100%',
      data: this.record
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onImageLoadingError() {
    this.imgSrc = this.defaultImgSrc;
  }
}


