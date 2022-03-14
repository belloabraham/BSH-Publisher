import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankTranferForeignFormComponent } from './bank-tranfer-foreign-form.component';
import { PaymentDetailsFormModule } from '../../payment-details-form/payment-details-form.module';



@NgModule({
  declarations: [BankTranferForeignFormComponent],
  imports: [
    CommonModule,
    PaymentDetailsFormModule
  ],
  exports: [
    BankTranferForeignFormComponent,
    PaymentDetailsFormModule
  ]
})
export class BankTranferForeignFormModule { }
