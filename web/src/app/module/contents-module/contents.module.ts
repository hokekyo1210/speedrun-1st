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
import { MatExpansionModule } from '@angular/material/expansion';

import { FlexLayoutModule } from '@angular/flex-layout';

import { VideoLinkService } from "../../Service/video-link.service";
import { RequestRecordResolver } from '../../Service/request-record-resolver.service';

import { TimerPipe } from "../../pipe/timer.pipe";

import { AppRoutingModule } from '../../app-routing.module';

import { VideoDetail } from './video-detail/video-detail.component';
import { HomeComponent } from './home/home.component';

import { DialogVideo } from "./video-dialog/video-dialog.component";

import { VideoCardComponent } from './home/video-card/video-card.component';

import { VideoDetailOverview } from './video-detail/video-detail-overview/video-detail-overview';
import { VideoDetailOvderviewHeader } from "./video-detail/video-detail-overview/video-detail-overview-hedder/video-detail-overview-header.component";
import { VideoDetailOverviewMain } from './video-detail/video-detail-overview/video-detail-overview-main/video-detail-overview-main.component';
import { VideoDetailInformation } from "./video-detail/video-detail-information/video-detail-information.component";
import { VideoDetailInformationRunner } from "./video-detail/video-detail-information-runner/video-detail-information-runner.component";

import { PlayerModule } from '../player-module/player.module';

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
    MatExpansionModule,

    FormsModule,
    BrowserModule,
    FlexLayoutModule,

    PlayerModule,
  ],
  declarations: [
    TimerPipe,

    HomeComponent,
    VideoCardComponent,

    VideoDetail,
    VideoDetailOverview,
    VideoDetailOvderviewHeader,
    VideoDetailOverviewMain,
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
export class ContentsModule {}
