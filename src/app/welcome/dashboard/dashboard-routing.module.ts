import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/domain/data/route';
import { DashboardComponent } from './dashboard.component';
import { PaymentInfoResolver } from './payment/payment-info.resolver';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: Route.MY_BOOKS,
      },
      {
        path: Route.MY_BOOKS,
        loadChildren: () =>
          import('./my-books/my-books.module').then((m) => m.MyBooksModule),
      },
      {
        path: Route.PAYMENT,
        resolve: { paymentDetails: PaymentInfoResolver },
        loadChildren: () =>
          import('./payment/payment.module').then((m) => m.PaymentModule),
      },
      {
        path: Route.COLLABORATORS,
        loadChildren: () =>
          import('./collaborators/collaborators.module').then(
            (m) => m.CollaboratorsModule
          ),
      },
      {
        path: Route.PROFILE,
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
