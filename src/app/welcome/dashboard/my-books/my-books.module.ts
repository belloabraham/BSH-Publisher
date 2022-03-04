import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyBooksRoutingModule } from './my-books-routing.module';
import { MyBooksComponent } from './my-books.component';


@NgModule({
  declarations: [
    MyBooksComponent
  ],
  imports: [
    CommonModule,
    MyBooksRoutingModule
  ]
})
export class MyBooksModule { }
