import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from "./home.component";
import { VideoDetail } from './video-module/video-detail/video-detail.component';
import { RequestRecordResolver } from './Service/request-record-resolver.service';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'runs/:runs-id', component: VideoDetail, resolve: { record: RequestRecordResolver } },
  // すべてのパスを/homeにリダイレクト
  { path: '**', redirectTo: '/runs/rkllwr8k', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
