import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/data/route';
import { RouteParams } from 'src/data/RouteParams';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
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
        path: Route.ADMIN,
        canMatch: [() => {
          const userAuth = inject(USER_AUTH_IJTOKEN)
          return userAuth.isAdmin()
        }],
        loadChildren: () =>
          import('./admin-dashboard/admin-dashboard.module').then(
            (m) => m.AdminDashboardModule
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
        path: `${Route.EDIT_YOUR_BOOK}:${RouteParams.BOOK_ID}`,
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
