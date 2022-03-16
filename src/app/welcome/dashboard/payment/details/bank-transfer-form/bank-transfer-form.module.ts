import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankTransferFormComponent } from './bank-transfer-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LyButtonModule } from '@alyle/ui/button';
import { TranslocoModule } from '@ngneat/transloco';
import { BankTranferForeignFormComponent } from './bank-tranfer-foreign-form/bank-tranfer-foreign-form.component';

@NgModule({
  declarations: [BankTransferFormComponent, BankTranferForeignFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LyButtonModule,
    TranslocoModule
  ],
  exports: [
    BankTransferFormComponent
  ]
})
export class BankTransferFormModule { }
