import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollaboratorsRoutingModule } from './collaborators-routing.module';
import { CollaboratorsComponent } from './collaborators.component';
import { TranslocoModule } from '@ngneat/transloco';
import { LyButtonModule } from '@alyle/ui/button';

@NgModule({
  declarations: [CollaboratorsComponent],
  imports: [
    CommonModule,
    CollaboratorsRoutingModule,
    TranslocoModule,
    LyButtonModule,
  ],
})
export class CollaboratorsModule {}
