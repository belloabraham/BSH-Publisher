import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRecordRoutingModule } from './sales-record-routing.module';
import { SalesRecordComponent } from './sales-record.component';
import { GridJsAngularModule } from 'gridjs-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { LyButtonModule } from '@alyle/ui/button';

@NgModule({
  declarations: [SalesRecordComponent],
  imports: [
    CommonModule,
    SalesRecordRoutingModule,
    GridJsAngularModule,
    ReactiveFormsModule,
    TranslocoModule,
    LyButtonModule
  ],
})
export class SalesRecordModule {}
