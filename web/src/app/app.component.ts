import { Component, OnInit } from '@angular/core';
import { Game } from './data/Game';
import { Category } from './data/Category';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title: string = 'HIKAKIN TV';
  videos: string[];

  ngOnInit(): void {

    this.videos = [
      "ieRcG0bXY84",
      "ThfRyRj_1KI",
      "Qq0_H0Zx51E",
      "UZcQ3rePQhs",
      "WJzSBLCaKc8",
      "fWIR4T1Y48E",
      "pni05ZkWioQ"
    ];

  }

}
