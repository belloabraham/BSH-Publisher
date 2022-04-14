import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/data/route';
import { EarningsResolver } from './earnings/earnings.resolver';
import { PaymentComponent } from './payment.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo:Route.DETAILS
      },
      {
        path: Route.DETAILS,
        loadChildren: () =>
          import('./details/details.module').then((m) => m.DetailsModule),
      },
      {
        path: Route.EARNINGS,
        resolve: {earnings: EarningsResolver},
        loadChildren: () =>
          import('./earnings/earnings.module').then((m) => m.EarningsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {}
