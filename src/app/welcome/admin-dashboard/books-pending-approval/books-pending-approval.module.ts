import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BooksPendingApprovalRoutingModule } from './books-pending-approval-routing.module';
import { BooksPendingApprovalComponent } from './books-pending-approval.component';
import { TranslocoModule } from '@ngneat/transloco';
import { LyGridModule } from '@alyle/ui/grid';
import { LyButtonModule } from '@alyle/ui/button';


@NgModule({
  declarations: [
    BooksPendingApprovalComponent
  ],
  imports: [
    CommonModule,
    BooksPendingApprovalRoutingModule,
    TranslocoModule,
    LyGridModule,
    LyButtonModule,
  ]
})
export class BooksPendingApprovalModule { }
