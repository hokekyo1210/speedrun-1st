import { NgModule } from '@angular/core';

import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { YouTubePlayerModule } from '@angular/youtube-player';

import { VideoComponent } from './video-card/video.component';
import { DialogVideo } from "./video-card/dialog-video.component";
import { TwitchPlayer } from "./video-card/twitch-player.component";

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

import { VideoLinkService } from "../Service/video-link.service";

import { TimerPipe } from "../pipe/timer.pipe";
import { VideoDetail } from './video-detail/video-detail.component';
import { RequestRecordResolver } from '../Service/request-record-resolver.service';

@NgModule({
  imports: [
    YouTubePlayerModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    BrowserModule,
  ],
  declarations: [
    VideoComponent,
    DialogVideo,
    TwitchPlayer,
    VideoDetail,
    TimerPipe
  ],
  providers: [
    VideoLinkService,
    RequestRecordResolver
  ],
  exports: [
    VideoComponent,
    VideoDetail,
  ]
})
export class VideoModule {}
