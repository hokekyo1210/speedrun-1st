import { Component, OnInit, ComponentFactory, ViewChild, ViewContainerRef, ComponentFactoryResolver } from "@angular/core";
import { VideoComponent } from './video-module/video-card/video.component';
import { RequestService } from './Service/request.service';
import { Record } from './data/Record';

@Component({
  selector: 'home',
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {
  factory: ComponentFactory<VideoComponent>;
  @ViewChild('dynamic', {read: ViewContainerRef}) viewContainerRef: ViewContainerRef;

  title: string = "Today's Run";

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
