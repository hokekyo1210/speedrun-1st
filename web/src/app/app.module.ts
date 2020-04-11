import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { MatSidenavModule } from "@angular/material/sidenav";

import { MenuModule } from './menu/menu.module';

import { VideoModule } from './video-module/video-module.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { RequestService } from './Service/RequestService';
import { HttpClientModule } from '@angular/common/http';
import { VideoComponent } from './video-module/video/video.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,

    FlexLayoutModule,
    MenuModule,

    VideoModule,

    MatSidenavModule,

    HttpClientModule,
  ],
  providers: [
    { provide: RequestService, useClass: RequestService, multi: false }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
