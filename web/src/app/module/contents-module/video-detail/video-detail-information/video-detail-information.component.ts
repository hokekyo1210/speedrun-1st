import { Component, OnInit, Input } from "@angular/core";
import { Record } from 'src/app/data/Record';

@Component({
  selector: 'video-detail-information',
  templateUrl: 'video-detail-information.component.html',
  styleUrls: ['video-detail-information.component.scss']
})
export class VideoDetailInformation implements OnInit {
  @Input() record: Record;
  ngOnInit() { }
}
