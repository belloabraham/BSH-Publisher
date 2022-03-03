import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/data/route';
import { WelcomeComponent } from './welcome.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('./complete-sign-up/complete-sign-up.module').then(
            (m) => m.CompleteSignUpModule
          ),
      },
      {
        path: Route.emptyBookStore,
        loadChildren: () =>
          import('./book-store/book-store.module').then(
            (m) => m.BookStoreModule
          ),
      },
      {
        path: Route.dashboard,
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeRoutingModule {}
