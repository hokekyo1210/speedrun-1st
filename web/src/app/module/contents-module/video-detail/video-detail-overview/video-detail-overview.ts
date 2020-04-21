import { Component, Input, OnInit } from "@angular/core";
import { Record } from 'src/app/data/Record';

@Component({
  selector: 'video-detail-overview',
  templateUrl: 'video-detail-overview.html',
  styleUrls: ['video-detail-overview.scss'],
})
export class VideoDetailOverview implements OnInit {
  @Input() record: Record;

  isOpened = false;
  ngOnInit() {
  }
}
