import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnpublishedComponent } from './unpublished.component';

const routes: Routes = [{ path: '', component: UnpublishedComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnpublishedRoutingModule { }
