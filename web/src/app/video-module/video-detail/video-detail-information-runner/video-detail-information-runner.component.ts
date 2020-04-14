import { Component, Input, OnInit } from "@angular/core";
import { BestPlayer } from 'src/app/data/Record';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import SnsList from "src/assets/sns.json";
import Countries from "src/assets/country.json";

interface SNS {
  name: string;
  imgSrc: string;
  url: SafeResourceUrl;
}

@Component({
  selector: 'information-runner',
  templateUrl: 'video-detail-information-runner.component.html',
  styleUrls: ['video-detail-information-runner.component.scss']
})
export class VideoDetailInformationRunner implements OnInit {
  @Input() player: BestPlayer
  safeUrl: SafeResourceUrl;

  snsList: SNS[];

  constructor(
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const c2code = this.getCountryCode(this.player.countryName);
    const url = 'https://www.speedrun.com/images/flags/' + c2code + '.png';
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    this.snsList = this.parseSnsUrl(this.player);
  }

  private parseSnsUrl(player: BestPlayer): SNS[] {
    const parser = {
      "twitch": player.twitch,
      "discord": null,
      "twitter": player.twitter,
      "youtube": player.youtube,
    };
    const list = new Array();
    SnsList.forEach(element => {
      list.push({
        name: element.name,
        imgSrc: element.imgSrc,
        url: parser[element.name] || null
      })
    });
    return list;
  }

  /**
   * 国旗画像を取得するため、2文字コードを検索
   * @param countryName
   */
  private getCountryCode(countryName) {
    let c2code = '';
    Countries.forEach(c => {
      if(c.name.startsWith(countryName)) {
        c2code = c.alpha2Code.toLowerCase();
      }
    });
    return c2code;
  }
}
