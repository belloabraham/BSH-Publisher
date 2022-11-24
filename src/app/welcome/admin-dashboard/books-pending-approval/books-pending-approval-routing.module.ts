import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksPendingApprovalComponent } from './books-pending-approval.component';

const routes: Routes = [{ path: '', component: BooksPendingApprovalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BooksPendingApprovalRoutingModule { }
