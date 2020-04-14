import { Component, OnInit, ComponentFactory, ViewChild, ViewContainerRef, ComponentFactoryResolver } from "@angular/core";
import { VideoCardComponent } from './video-card/video-card.component';
import { RequestService } from '../../Service/request.service';
import { Record } from '../../data/Record';

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit {
  factory: ComponentFactory<VideoCardComponent>;
  @ViewChild('videoCardPlace', {read: ViewContainerRef}) viewContainerRef: ViewContainerRef;

  private request: Promise<void>;

  constructor(
    private resolver: ComponentFactoryResolver,
    private requester: RequestService
  ) { }

  ngOnInit(): void {
    this.factory = this.resolver.resolveComponentFactory(VideoCardComponent);

    this.loadRecord();
  }

  private addRecord(records: Record[]) {
    records.forEach((record) => {
      const componet = this.viewContainerRef.createComponent(this.factory);
      componet.instance.record = record;
    })
  }

  scrollEvent(event) {
    const target = event.target;
    console.log(target);
    if(target.scrollTop == target.scrollTopMax){
      console.log("一番下");
    }
  }

  public loadRecord() {
    if(this.request != null)
      return;

    this.request = this.requester.getRecords(20, 0)
      .then((e) => this.addRecord(e))
      .finally(() => this.request = null);
  }
}
