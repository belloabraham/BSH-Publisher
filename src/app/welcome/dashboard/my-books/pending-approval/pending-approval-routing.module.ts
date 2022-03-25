import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingApprovalComponent } from './pending-approval.component';

const routes: Routes = [{ path: '', component: PendingApprovalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingApprovalRoutingModule { }
