import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/data/route';
import { AdminDashboardComponent } from './admin-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: Route.PENDING_APPROVAL,
      },
      {
        path: Route.PENDING_APPROVAL,
        loadChildren: () =>
          import('./books-pending-approval/books-pending-approval.module').then(
            (m) => m.BooksPendingApprovalModule
          ),
      },
      {
        path: Route.PAYMENT_REQUEST,
        loadChildren: () =>
          import(
            './publishers-payment-request/publishers-payment-request.module'
          ).then((m) => m.PublishersPaymentRequestModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule { }
