import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollaborationsRoutingModule } from './collaborations-routing.module';
import { CollaborationsComponent } from './collaborations.component';
import { TranslocoModule } from '@ngneat/transloco';
import { LyMenuModule } from '@alyle/ui/menu';
import { LyButtonModule } from '@alyle/ui/button';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [CollaborationsComponent],
  imports: [
    CommonModule,
    CollaborationsRoutingModule,
    TranslocoModule,
    LyButtonModule,
    LyMenuModule,
    ClipboardModule,
  ],
  exports: [CollaborationsComponent, TranslocoModule],
})
export class CollaborationsModule {}
