import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollaboratorsRoutingModule } from './collaborators-routing.module';
import { CollaboratorsComponent } from './collaborators.component';
import { TranslocoModule } from '@ngneat/transloco';
import { LyButtonModule } from '@alyle/ui/button';
import { LyTabsModule } from '@alyle/ui/tabs';

@NgModule({
  declarations: [CollaboratorsComponent],
  imports: [
    CommonModule,
    CollaboratorsRoutingModule,
    TranslocoModule,
    LyButtonModule,
    LyTabsModule
  ],
})
export class CollaboratorsModule {}
