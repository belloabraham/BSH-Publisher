import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendingPublishedRoutingModule } from './pending-published-routing.module';
import { PendingPublishedComponent } from './pending-published.component';


@NgModule({
  declarations: [
    PendingPublishedComponent
  ],
  imports: [
    CommonModule,
    PendingPublishedRoutingModule
  ]
})
export class PendingPublishedModule { }
