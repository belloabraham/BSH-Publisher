import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/data/route';
import { BookStoreComponent } from './book-store.component';

const routes: Routes = [
  {
    path: '',
    component: BookStoreComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('./empty-store/empty-store.module').then(
            (m) => m.EmptyStoreModule
          ),
      },
      {
        path: Route.publishYourBook,
        loadChildren: () =>
          import('../publish-your-book/publish-your-book.module').then(
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
export class BookStoreRoutingModule {}
