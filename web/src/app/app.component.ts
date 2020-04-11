import { Component, OnInit, ComponentFactory, ViewChild } from '@angular/core';
import { ComponentFactoryResolver, ViewContainerRef } from '@angular/core'

import { RequestService } from './Service/RequestService';

import { Record } from "./data/Record";
import { VideoComponent } from './video-module/video/video.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  factory: ComponentFactory<VideoComponent>;
  @ViewChild('dynamic', {read: ViewContainerRef}) viewContainerRef: ViewContainerRef;

  title: string = "Today's Run";

  // records: Record[] = new Array<Record>();

  constructor(
    private resolver: ComponentFactoryResolver,
    private requester: RequestService
  ) { }

  ngOnInit(): void {
    this.factory = this.resolver.resolveComponentFactory(VideoComponent);
    this.requester.getRecords(20, 0)
      .then((e) => {
        this.addRecord(e);
      });
  }

  public addRecord(records: Record[]) {
    records.forEach((record) => {
      const componet = this.viewContainerRef.createComponent(this.factory);
      componet.instance.record = record;
    })
  }

}
