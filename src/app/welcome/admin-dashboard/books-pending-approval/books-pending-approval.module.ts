import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BooksPendingApprovalRoutingModule } from './books-pending-approval-routing.module';
import { BooksPendingApprovalComponent } from './books-pending-approval.component';
import { TranslocoModule } from '@ngneat/transloco';


@NgModule({
  declarations: [
    BooksPendingApprovalComponent
  ],
  imports: [
    CommonModule,
    BooksPendingApprovalRoutingModule,
    TranslocoModule
  ]
})
export class BooksPendingApprovalModule { }
