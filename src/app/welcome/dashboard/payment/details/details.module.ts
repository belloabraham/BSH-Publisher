import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsRoutingModule } from './details-routing.module';
import { DetailsComponent } from './details.component';
import { TranslocoModule } from '@ngneat/transloco';
import { LyButtonModule } from '@alyle/ui/button';
import { ReactiveFormsModule } from '@angular/forms';
import { PaypalFormModule } from './paypal-form/paypal-form.module';
import { BankTransferFormModule } from './bank-transfer-form/bank-transfer-form.module';
import { SkrillFormModule } from './skrill-form/skrill-form.module';


@NgModule({
  declarations: [
    DetailsComponent
  ],
  imports: [
    CommonModule,
    DetailsRoutingModule,
    TranslocoModule,
    LyButtonModule,
    ReactiveFormsModule,
    PaypalFormModule,
    BankTransferFormModule,
    SkrillFormModule
  ]
})
export class DetailsModule { }
