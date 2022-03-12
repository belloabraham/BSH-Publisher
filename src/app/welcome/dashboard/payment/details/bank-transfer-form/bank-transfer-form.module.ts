import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankTransferFormComponent } from './bank-transfer-form.component';
import { PaymentDetailsFormModule } from '../payment-details-form/payment-details-form.module';



@NgModule({
  declarations: [BankTransferFormComponent],
  imports: [
    CommonModule,
    PaymentDetailsFormModule
  ],
  exports: [
    BankTransferFormComponent
  ]
})
export class BankTransferFormModule { }
