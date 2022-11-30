import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/data/route';
import { PaymentComponent } from './payment.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: Route.DETAILS,
      },
      {
        path: Route.DETAILS,
        loadChildren: () =>
          import('../../dashboard/payment/details/details.module').then(
            (m) => m.DetailsModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
