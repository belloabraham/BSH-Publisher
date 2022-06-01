import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublishedRoutingModule } from './published-routing.module';
import { PublishedComponent } from './published.component';
import { TranslocoModule } from '@ngneat/transloco';
import { LyButtonModule } from '@alyle/ui/button';
import { LyTooltipModule } from '@alyle/ui/tooltip';

import { LyMenuModule } from '@alyle/ui/menu';
import { LyDividerModule } from '@alyle/ui/divider';
import { LyIconModule } from '@alyle/ui/icon';

@NgModule({
  declarations: [PublishedComponent],
  imports: [
    CommonModule,
    PublishedRoutingModule,
    TranslocoModule,
    LyButtonModule,
    LyIconModule,
    LyMenuModule,
    LyDividerModule,
    LyTooltipModule,
  ],
})
export class PublishedModule {}
