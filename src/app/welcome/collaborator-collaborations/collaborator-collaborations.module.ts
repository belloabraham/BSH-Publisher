import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollaboratorCollaborationsRoutingModule } from './collaborator-collaborations-routing.module';
import { CollaboratorCollaborationsComponent } from './collaborator-collaborations.component';
import { CollaborationsModule } from 'src/app/shared/collaborations/collaborations.module';
import { LyTooltipModule } from '@alyle/ui/tooltip';
import { TranslocoModule } from '@ngneat/transloco';
import { LyButtonModule } from '@alyle/ui/button';

@NgModule({
  declarations: [CollaboratorCollaborationsComponent],
  imports: [
    CommonModule,
    CollaboratorCollaborationsRoutingModule,
    CollaborationsModule,
    TranslocoModule,
    LyButtonModule,
    LyTooltipModule
  ],
})
export class CollaboratorCollaborationsModule {}
