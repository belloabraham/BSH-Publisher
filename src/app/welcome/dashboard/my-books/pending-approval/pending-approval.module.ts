import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendingApprovalRoutingModule } from './pending-approval-routing.module';
import { PendingApprovalComponent } from './pending-approval.component';


@NgModule({
  declarations: [
    PendingApprovalComponent
  ],
  imports: [
    CommonModule,
    PendingApprovalRoutingModule
  ]
})
export class PendingApprovalModule { }
