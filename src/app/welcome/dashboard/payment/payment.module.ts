import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';
import { TranslocoModule } from '@ngneat/transloco';
import { LyButtonModule } from '@alyle/ui/button';

@NgModule({
  declarations: [
   PaymentComponent
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    TranslocoModule,
    LyButtonModule
  ]
})
export class PaymentModule { }
