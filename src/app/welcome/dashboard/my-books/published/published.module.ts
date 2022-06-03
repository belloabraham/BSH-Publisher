import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublishedRoutingModule } from './published-routing.module';
import { PublishedComponent } from './published.component';
import { TranslocoModule } from '@ngneat/transloco';
import { LyButtonModule } from '@alyle/ui/button';
import { LyTooltipModule } from '@alyle/ui/tooltip';
import { LyCommonModule } from '@alyle/ui';
import { LyMenuModule } from '@alyle/ui/menu';
import { LyDividerModule } from '@alyle/ui/divider';

@NgModule({
  declarations: [PublishedComponent],
  imports: [
    CommonModule,
    PublishedRoutingModule,
    TranslocoModule,
    LyButtonModule,
    LyCommonModule,
    LyMenuModule,
    LyTooltipModule,
  ],
})
export class PublishedModule {}
