import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/data/route';
import { CanDeactivateGuard } from 'src/guards/can-deactivate.guard';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: Route.myBooks,
      },
      {
        path: Route.myBooks,
        loadChildren: () =>
          import('./my-books/my-books.module').then((m) => m.MyBooksModule),
      },
      {
        path: Route.payment,
        loadChildren: () =>
          import('./payment/payment.module').then((m) => m.PaymentModule),
      },
      {
        path: Route.collaborators,
        loadChildren: () =>
          import('./collaborators/collaborators.module').then(
            (m) => m.CollaboratorsModule
          ),
      },
      {
        path: Route.profile,
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: Route.notifications,
        loadChildren: () =>
          import('./notifications/notifications.module').then(
            (m) => m.NotificationsModule
          ),
      },
      {
        path: Route.error,
        loadChildren: () =>
          import('../../shared/error/error.module').then((m) => m.ErrorModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
