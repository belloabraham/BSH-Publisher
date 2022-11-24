import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollaboratorCollaborationsComponent } from './collaborator-collaborations.component';

const routes: Routes = [{ path: '', component: CollaboratorCollaborationsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollaboratorCollaborationsRoutingModule { }
