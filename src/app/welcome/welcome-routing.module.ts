import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/data/route';
import { RouteParams } from 'src/data/RouteParams';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { CollaborationsResolver } from '../shared/collaborations/collaborations.resolver';
import { UnapprovedPublishedBooksResolver } from './admin-dashboard/books-pending-approval/unapproved-published-books.resolver';
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
        canMatch: [
          () => {
            const userAuth = inject(USER_AUTH_IJTOKEN);
            return userAuth.isAdmin();
          },
        ],
        resolve: { unApprovedBooks: UnapprovedPublishedBooksResolver },
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
        path: `${Route.EDIT_YOUR_BOOK}/:${RouteParams.BOOK_ID}`,
        loadChildren: () =>
          import('./edit-your-book/edit-your-book.module').then(
            (m) => m.EditYourBookModule
          ),
      },
      {
        path: Route.COLLABORATOR,
        resolve: { collaborations: CollaborationsResolver },
        loadChildren: () =>
          import(
            './collaborator-collaborations/collaborator-collaborations.module'
          ).then((m) => m.CollaboratorCollaborationsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeRoutingModule {}
