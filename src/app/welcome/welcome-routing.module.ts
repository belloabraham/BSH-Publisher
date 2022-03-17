import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/domain/data/route';
import { PublishedBooksGuard } from './dashboard/published-books.guard';
import { NoPublishedBooksGuard } from './empty-book-store/no-published-books.guard';
import { WelcomeComponent } from './welcome.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        canLoad: [NoPublishedBooksGuard],
        loadChildren: () =>
          import('./empty-book-store/empty-book-store.module').then(
            (m) => m.EmptyBookStoreModule
          ),
      },
      {
        path: Route.dashboard,
        canLoad: [PublishedBooksGuard],
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
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
  { path: 'welcome/empty-book-store', loadChildren: () => import('./empty-book-store/empty-book-store.module').then(m => m.EmptyBookStoreModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeRoutingModule {}
