import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/data/route';
import { MyBooksComponent } from './my-books.component';

const routes: Routes = [
  {
    path: '',
    component: MyBooksComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: Route.PUBLISHED,
      },
      {
        path: Route.PUBLISHED,
        loadChildren: () =>
          import('./published/published.module').then((m) => m.PublishedModule),
      },
      {
        path: Route.UNPUBLISHED,
        loadChildren: () =>
          import('./unpublished/unpublished.module').then(
            (m) => m.UnpublishedModule
          ),
      },
      {
        path: Route.PENDING_APPROVAL,
        loadChildren: () =>
          import('./pending-approval/pending-approval.module').then(
            (m) => m.PendingApprovalModule
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
