import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EarningsRoutingModule } from './earnings-routing.module';
import { EarningsComponent } from './earnings.component';
import { TranslocoModule } from '@ngneat/transloco';
import { LyButtonModule } from '@alyle/ui/button';
import { LyTooltipModule } from '@alyle/ui/tooltip';


@NgModule({
  declarations: [
    EarningsComponent
  ],
  imports: [
    CommonModule,
    EarningsRoutingModule,
    TranslocoModule,
    LyButtonModule,
    LyTooltipModule
  ]
})
export class EarningsModule { }
