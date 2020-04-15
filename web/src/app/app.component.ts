import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  scrollEvent(event) {
    const target = event.target;
    if(target.scrollTop == target.scrollTopMax) {
      // スクロールイベント
      console.log('一番下')
    }
  }

}
