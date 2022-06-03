import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollaboratorsRoutingModule } from './collaborators-routing.module';
import { CollaboratorsComponent } from './collaborators.component';
import { TranslocoModule } from '@ngneat/transloco';
import { LyButtonModule } from '@alyle/ui/button';
import { LyTabsModule } from '@alyle/ui/tabs';
import { LyDialogModule } from '@alyle/ui/dialog';
import { LyOverlayModule } from '@alyle/ui';
import { AddCollaboratorsDialogComponent } from './add-collaborators-dialog/add-collaborators-dialog.component';

@NgModule({
  declarations: [CollaboratorsComponent, AddCollaboratorsDialogComponent],
  imports: [
    CommonModule,
    CollaboratorsRoutingModule,
    TranslocoModule,
    LyButtonModule,
    LyOverlayModule,
    LyDialogModule,
  ],
})
export class CollaboratorsModule {}
