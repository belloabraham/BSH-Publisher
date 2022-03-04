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
        loadChildren: () =>
          import('./book-list/book-list.module').then((m) => m.BookListModule),
      },
      {
        path: Route.publishYourBook,
        loadChildren: () =>
          import('../../../shared/publish-book/publish-book.module').then(
            (m) => m.PublishBookModule
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
