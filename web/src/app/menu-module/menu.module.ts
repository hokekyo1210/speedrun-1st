import { NgModule } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule }from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from '@angular/material/form-field';

import { ToolBar } from './tool-bar/tool-bar';
import { SideMenu } from './side-menu/side-menu';

import { AppRoutingModule } from './../app-routing.module';

@NgModule({
  imports: [
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule
  ],
  declarations: [ToolBar, SideMenu],
  exports: [ToolBar, SideMenu]
})
export class MenuModule {}

