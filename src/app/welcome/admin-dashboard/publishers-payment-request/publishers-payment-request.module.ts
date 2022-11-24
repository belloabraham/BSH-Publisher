import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublishersPaymentRequestRoutingModule } from './publishers-payment-request-routing.module';
import { PublishersPaymentRequestComponent } from './publishers-payment-request.component';


@NgModule({
  declarations: [
    PublishersPaymentRequestComponent
  ],
  imports: [
    CommonModule,
    PublishersPaymentRequestRoutingModule
  ]
})
export class PublishersPaymentRequestModule { }
