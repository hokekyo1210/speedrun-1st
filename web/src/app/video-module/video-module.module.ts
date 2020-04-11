import { NgModule } from '@angular/core';

import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { YouTubePlayerModule } from '@angular/youtube-player';

import { VideoComponent } from './video/video.component';
import { DialogVideo } from "./video/dialog-video";
import { TwitchPlayer } from "./video/twitch-player.component";

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

import { VideoLinkService } from "../Service/VideoLinkService";

import { TimerPipe } from "../pipe/timer.pipe";

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
    TimerPipe
  ],
  providers: [VideoLinkService],
  exports: [VideoComponent]
})
export class VideoModule {}
