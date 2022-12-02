import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollaboratorsRoutingModule } from './collaborators-routing.module';
import { CollaboratorsComponent } from './collaborators.component';
import { TranslocoModule } from '@ngneat/transloco';
import { LyButtonModule } from '@alyle/ui/button';
import { LyDialogModule } from '@alyle/ui/dialog';
import { LyOverlayModule } from '@alyle/ui';
import { AddCollaboratorsDialogComponent } from './add-collaborators-dialog/add-collaborators-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { LyMenuModule } from '@alyle/ui/menu';

@NgModule({
  declarations: [CollaboratorsComponent, AddCollaboratorsDialogComponent],
  imports: [
    CommonModule,
    CollaboratorsRoutingModule,
    TranslocoModule,
    ReactiveFormsModule,
    LyButtonModule,
    LyOverlayModule,
    LyDialogModule,
    ClipboardModule,
    LyMenuModule,
  ],
})
export class CollaboratorsModule {}
