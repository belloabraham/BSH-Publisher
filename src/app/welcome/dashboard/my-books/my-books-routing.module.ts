import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/domain/data/route';
import { MyBooksComponent } from './my-books.component';

const routes: Routes = [
  {
    path: '',
    component: MyBooksComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: Route.published
      },
      {
        path: Route.published,
        loadChildren: () =>
          import('./published/published.module').then((m) => m.PublishedModule),
      },
      {
        path: Route.unpublished,
        loadChildren: () =>
          import('./unpublished/unpublished.module').then(
            (m) => m.UnpublishedModule
          ),
      },
      {
        path: Route.pendingApproval,
        loadChildren: () =>
          import('./pending-published/pending-published.module').then(
            (m) => m.PendingPublishedModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyBooksRoutingModule {}
