import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/domain/data/route';
import { CollaboratorsResolver } from './collaborators/collaborators.resolver';
import { DashboardComponent } from './dashboard.component';

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
        loadChildren: () =>
          import('./payment/payment.module').then((m) => m.PaymentModule),
      },
      {
        path: Route.COLLABORATORS,
        resolve: {collaborators: CollaboratorsResolver},
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
