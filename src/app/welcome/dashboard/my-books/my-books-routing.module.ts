import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/data/route';
import { MyBooksComponent } from './my-books.component';

const routes: Routes = [
  {
    path: '',
    component: MyBooksComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyBooksRoutingModule {}
