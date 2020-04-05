import { NgModule } from '@angular/core';
import { YouTubePlayerModule } from '@angular/youtube-player';

import { VideoComponent } from './video/video.component';

import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  imports: [
    YouTubePlayerModule,
    MatCardModule,
    MatButtonModule
  ],
  declarations: [VideoComponent],
  exports: [VideoComponent]
})
export class VideoModule {}
