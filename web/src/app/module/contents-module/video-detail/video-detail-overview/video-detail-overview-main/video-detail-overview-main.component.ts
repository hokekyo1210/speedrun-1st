import { Component, OnInit, Input } from '@angular/core';
import { Record } from 'src/app/data/Record';

@Component({
  selector: 'video-detail-overview-main',
  templateUrl: './video-detail-overview-main.component.html',
  styleUrls: ['./video-detail-overview-main.component.scss']
})
export class VideoDetailOverviewMain implements OnInit {
  @Input() record: Record;

  constructor(

  ) { }

  ngOnInit(): void {
  }

  getUserIconUrl(index: number) {
    return `https://www.speedrun.com/themes/user/${this.record.bestPlayers[index].playerName}/image.png`;
  }
}
