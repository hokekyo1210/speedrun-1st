import { NgModule } from '@angular/core';

import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTabsModule } from "@angular/material/tabs";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";

import { FlexLayoutModule } from '@angular/flex-layout';

import { VideoLinkService } from "./../../Service/video-link.service";
import { RequestRecordResolver } from './../../Service/request-record-resolver.service';

import { TimerPipe } from "./../../pipe/timer.pipe";
import { VideoDetail } from './video-detail/video-detail.component';

import { TwitchPlayer } from "./tiwitch-player/twitch-player.component";
import { YoutubePlayer } from "./youtube-player/youtube-player.component";

import { HomeComponent } from './home/home.component';

import { VideoCardComponent } from './home/video-card/video-card.component';
import { DialogVideo } from "./video-dialog/video-dialog.component";

import { VideoDetailInformation } from "./video-detail/video-detail-information/video-detail-information.component";
import { VideoDetailInformationRunner } from "./video-detail/video-detail-information-runner/video-detail-information-runner.component";

import { AppRoutingModule } from './../../app-routing.module';
import { VideoDetailOverview } from './video-detail/video-detail-overview/video-detail-overview';
import { BilibiliPlayer } from './bilibili-player/bilibili-player.component';


@NgModule({
  imports: [
    AppRoutingModule,

    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    MatListModule,
    MatSidenavModule,

    FormsModule,
    BrowserModule,
    FlexLayoutModule,
  ],
  declarations: [
    TimerPipe,

    HomeComponent,
    VideoCardComponent,

    VideoDetail,
    TwitchPlayer,
    YoutubePlayer,
    BilibiliPlayer,
    VideoDetailOverview,
    VideoDetailInformation,
    VideoDetailInformationRunner,

    DialogVideo,

  ],
  providers: [
    VideoLinkService,
    RequestRecordResolver
  ],
  exports: [
    HomeComponent,
    VideoDetail,
  ]
})
export class VideoModule {}
