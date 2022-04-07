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
        path: Route.SALES_RECORD,
        loadChildren: () =>
          import('./sales-record/sales-record.module').then(
            (m) => m.SalesRecordModule
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
