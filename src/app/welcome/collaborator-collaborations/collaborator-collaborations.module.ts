import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollaboratorCollaborationsRoutingModule } from './collaborator-collaborations-routing.module';
import { CollaboratorCollaborationsComponent } from './collaborator-collaborations.component';
import { CollaborationsModule } from 'src/app/shared/collaborations/collaborations.module';


@NgModule({
  declarations: [CollaboratorCollaborationsComponent],
  imports: [
    CommonModule,
    CollaboratorCollaborationsRoutingModule,
    CollaborationsModule,
  ],
})
export class CollaboratorCollaborationsModule {}
