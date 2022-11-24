import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublisherCollaborationsComponent } from './publisher-collaborations.component';

const routes: Routes = [{ path: '', component: PublisherCollaborationsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublisherCollaborationsRoutingModule { }
