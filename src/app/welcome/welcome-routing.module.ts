import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/data/route';
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
        redirectTo: Route.DASHBOARD,
      },
      {
        path: Route.DASHBOARD,
        resolve: { allBooks: PublishedBooksResolver },
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: Route.EMPTY_BOOK_STORE,
        loadChildren: () =>
          import('./empty-book-store/empty-book-store.module').then(
            (m) => m.EmptyBookStoreModule
          ),
      },
      {
        path: Route.PUBLISH_YOUR_BOOK,
        loadChildren: () =>
          import('./publish-your-book/publish-your-book.module').then(
            (m) => m.PublishYourBookModule
          ),
      },
      {
        path: Route.EDIT_YOUR_BOOK,
        loadChildren: () =>
          import('./edit-your-book/edit-your-book.module').then(
            (m) => m.EditYourBookModule
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
