import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublishedRoutingModule } from './published-routing.module';
import { PublishedComponent } from './published.component';
import { TranslocoModule } from '@ngneat/transloco';
import { LyButtonModule } from '@alyle/ui/button';
import { LyMenuModule } from '@alyle/ui/menu';

@NgModule({
  declarations: [PublishedComponent],
  imports: [
    CommonModule,
    PublishedRoutingModule,
    TranslocoModule,
    LyButtonModule,
    LyMenuModule,
  ],
})
export class PublishedModule {}
