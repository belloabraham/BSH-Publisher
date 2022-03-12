import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkrillFormComponent } from './skrill-form.component';
import { PaymentDetailsFormModule } from '../payment-details-form/payment-details-form.module';



@NgModule({
  declarations: [SkrillFormComponent],
  imports: [
    CommonModule,
    PaymentDetailsFormModule
  ],
  exports: [
    SkrillFormComponent
  ]
})
export class SkrillFormModule { }
