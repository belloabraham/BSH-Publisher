import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollaborationsComponent } from './collaborations.component';

const routes: Routes = [{ path: '', component: CollaborationsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollaborationsRoutingModule { }
