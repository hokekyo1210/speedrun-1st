import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { MatSidenavModule } from "@angular/material/sidenav";

import { MenuModule } from './menu-module/menu.module';

import { VideoModule } from './video-module/video.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { RequestService } from './Service/request.service';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home.component';
import { AppRoutingModule } from './app-routing.module';
import { YouTubePlayerModule } from '@angular/youtube-player';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    AppRoutingModule,

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
