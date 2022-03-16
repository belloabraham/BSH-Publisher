import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsRoutingModule } from './details-routing.module';
import { DetailsComponent } from './details.component';
import { TranslocoModule } from '@ngneat/transloco';
import { LyButtonModule } from '@alyle/ui/button';
import { ReactiveFormsModule } from '@angular/forms';
import { BankTransferFormModule } from './bank-transfer-form/bank-transfer-form.module';
import { SkrillFormComponent } from './skrill-form/skrill-form.component';
import { PaypalFormComponent } from './paypal-form/paypal-form.component';


@NgModule({
  declarations: [
    DetailsComponent, SkrillFormComponent, PaypalFormComponent
  ],
  imports: [
    CommonModule,
    DetailsRoutingModule,
    TranslocoModule,
    LyButtonModule,
    ReactiveFormsModule,
    BankTransferFormModule,
  ]
})
export class DetailsModule { }
