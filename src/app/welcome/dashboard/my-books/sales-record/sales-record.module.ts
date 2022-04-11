import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRecordRoutingModule } from './sales-record-routing.module';
import { SalesRecordComponent } from './sales-record.component';
import { GridJsAngularModule } from 'gridjs-angular';

@NgModule({
  declarations: [SalesRecordComponent],
  imports: [CommonModule, SalesRecordRoutingModule, GridJsAngularModule],
})
export class SalesRecordModule {}
