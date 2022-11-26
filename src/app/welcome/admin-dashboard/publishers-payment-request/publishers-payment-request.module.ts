import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublishersPaymentRequestRoutingModule } from './publishers-payment-request-routing.module';
import { PublishersPaymentRequestComponent } from './publishers-payment-request.component';
import { TranslocoModule } from '@ngneat/transloco';
import { LyExpansionModule } from '@alyle/ui/expansion';
import { LyButtonModule } from '@alyle/ui/button';
import { LyTableModule } from '@alyle/ui/table';
import { LyCommonModule, LyThemeModule } from '@alyle/ui';


@NgModule({
  declarations: [PublishersPaymentRequestComponent],
  imports: [
    CommonModule,
    PublishersPaymentRequestRoutingModule,
    LyExpansionModule,
    TranslocoModule,
    LyButtonModule,
    LyTableModule,
  ],
})
export class PublishersPaymentRequestModule {}
