import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollaborationsRoutingModule } from './collaborations-routing.module';
import { CollaborationsComponent } from './collaborations.component';
import { TranslocoModule } from '@ngneat/transloco';
import { LyButtonModule } from '@alyle/ui/button';

@NgModule({
  declarations: [CollaborationsComponent],
  imports: [CommonModule, CollaborationsRoutingModule, TranslocoModule],
  exports: [CollaborationsComponent, TranslocoModule, LyButtonModule, ],
})
export class CollaborationsModule {}
