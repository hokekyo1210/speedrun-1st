import { Component, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'tool-bar',
  templateUrl: 'tool-bar.html',
  styleUrls: ['tool-bar.scss'],
})
export class ToolBar {
  @Output() openSideMenuEvent = new EventEmitter();

  showSideMenu(): void {
    this.openSideMenuEvent.emit();
  }

}
