import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from "./video-module/home/home.component";
import { VideoDetail } from './video-module/video-detail/video-detail.component';
import { RequestRecordResolver } from './Service/request-record-resolver.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'runs/:runs-id/:category-id', component: VideoDetail, resolve: { record: RequestRecordResolver } },
  // すべてのパスを/homeにリダイレクト rkllz18k
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
