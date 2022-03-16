import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/data/route';
import { NoPublishedBooksGuard } from './book-store/no-published-books.guard';
import { PublishedBooksGuard } from './dashboard/published-books.guard';
import { WelcomeComponent } from './welcome.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        canLoad:[NoPublishedBooksGuard],
        loadChildren: () =>
          import('./book-store/book-store.module').then(
            (m) => m.BookStoreModule
          ),
      },
      {
        path: Route.dashboard,
        canLoad:[PublishedBooksGuard],
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
