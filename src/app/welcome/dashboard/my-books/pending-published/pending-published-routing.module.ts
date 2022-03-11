import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingPublishedComponent } from './pending-published.component';

const routes: Routes = [{ path: '', component: PendingPublishedComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingPublishedRoutingModule { }
