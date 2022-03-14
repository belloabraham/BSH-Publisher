import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankTransferFormComponent } from './bank-transfer-form.component';
import { PaymentDetailsFormModule } from '../payment-details-form/payment-details-form.module';
import { BankTranferForeignFormModule } from './bank-tranfer-foreign-form/bank-tranfer-foreign-form.module';

@NgModule({
  declarations: [BankTransferFormComponent],
  imports: [
    CommonModule,
    BankTranferForeignFormModule
  ],
  exports: [
    BankTransferFormComponent
  ]
})
export class BankTransferFormModule { }
