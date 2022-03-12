import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaypalFormComponent } from './paypal-form.component';
import { PaymentDetailsFormModule } from '../payment-details-form/payment-details-form.module';



@NgModule({
  declarations: [PaypalFormComponent],
  imports: [
    CommonModule,
    PaymentDetailsFormModule
  ],
  exports: [
    PaypalFormComponent,
  ]
})
export class PaypalFormModule { }
