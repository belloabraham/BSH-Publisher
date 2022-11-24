import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BooksPendingApprovalRoutingModule } from './books-pending-approval-routing.module';
import { BooksPendingApprovalComponent } from './books-pending-approval.component';


@NgModule({
  declarations: [
    BooksPendingApprovalComponent
  ],
  imports: [
    CommonModule,
    BooksPendingApprovalRoutingModule
  ]
})
export class BooksPendingApprovalModule { }
