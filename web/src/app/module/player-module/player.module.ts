import { NgModule } from '@angular/core';

import { RootPlayer } from './root-player/root-player.component';

import { TwitchPlayer } from "../player-module/tiwitch-player/twitch-player.component";
import { YoutubePlayer } from "../player-module/youtube-player/youtube-player.component";
import { BilibiliPlayer } from '../player-module/bilibili-player/bilibili-player.component';
import { NiconicoPlayer } from '../player-module/niconico-player/niconico-player.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    RootPlayer,
    TwitchPlayer,
    YoutubePlayer,
    BilibiliPlayer,
    NiconicoPlayer,
  ],
  providers: [],
  exports: [
    TwitchPlayer,
    YoutubePlayer,
    BilibiliPlayer,
    NiconicoPlayer,
    RootPlayer,
  ]
})
export class PlayerModule {}
