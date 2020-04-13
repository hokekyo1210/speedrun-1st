import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogVideo } from './dialog-video.component';

import { Record } from '../../data/Record'
import { VideoLinkService } from 'src/app/Service/video-link.service';

@Component({
  templateUrl: 'video.component.html',
  selector: 'app-video',
  styleUrls: ['video.component.scss'],
})
export class VideoComponent implements OnInit {
  @Input() record: Record;

  constructor(
    public dialog: MatDialog,
    private videoLinkService: VideoLinkService
  ) { }

  ngOnInit() {}

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

  getThumbnailUrl() {
    try {
      const url = new URL(this.record.bestVideoLink);
      return this.videoLinkService.getThumbnailUrl(url);
    } catch (error) {
      return "";
    }
  }
}


