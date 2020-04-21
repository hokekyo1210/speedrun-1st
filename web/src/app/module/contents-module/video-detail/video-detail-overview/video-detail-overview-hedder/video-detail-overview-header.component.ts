import { Component, OnInit, Input } from '@angular/core';
import { Record } from 'src/app/data/Record';

@Component({
  selector: 'video-detail-overview-header',
  templateUrl: './video-detail-overview-header.component.html',
  styleUrls: ['./video-detail-overview-header.component.scss']
})
export class VideoDetailOvderviewHeader implements OnInit {
  @Input() record: Record;

  constructor() { }

  ngOnInit(): void {
  }

}
