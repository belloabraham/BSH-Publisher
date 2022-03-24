import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/domain/data/route';
import { PublishedBooksResolver } from './dashboard/published-books.resolver';
import { WelcomeComponent } from './welcome.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: Route.dashboard,
      },
      {
        path: Route.dashboard,
        resolve: { allBooks: PublishedBooksResolver },
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: Route.emptyBookStore,
        loadChildren: () =>
          import('./empty-book-store/empty-book-store.module').then(
            (m) => m.EmptyBookStoreModule
          ),
      },
      {
        path: Route.publishYourBook,
        loadChildren: () =>
          import('./publish-your-book/publish-your-book.module').then(
            (m) => m.PublishYourBookModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeRoutingModule {}
