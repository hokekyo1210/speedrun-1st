import { Component, OnInit, ComponentFactory, ViewChild } from '@angular/core';
import { ComponentFactoryResolver, ViewContainerRef } from '@angular/core'

import { RequestService } from './Service/request.service';

import { Record } from "./data/Record";
import { VideoComponent } from './video-module/video-card/video.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent { }
