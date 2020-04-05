import { NgModule } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule }from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from "@angular/material/sidenav";

import { ToolBar } from './tool-bar/tool-bar';

@NgModule({
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule
  ],
  declarations: [ToolBar],
  exports: [ToolBar]
})
export class MenuModule {}

