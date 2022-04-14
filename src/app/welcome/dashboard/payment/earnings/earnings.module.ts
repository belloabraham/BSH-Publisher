import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EarningsRoutingModule } from './earnings-routing.module';
import { EarningsComponent } from './earnings.component';
import { TranslocoModule } from '@ngneat/transloco';
import { LyButtonModule } from '@alyle/ui/button';


@NgModule({
  declarations: [
    EarningsComponent
  ],
  imports: [
    CommonModule,
    EarningsRoutingModule,
    TranslocoModule,
    LyButtonModule,
  ]
})
export class EarningsModule { }
