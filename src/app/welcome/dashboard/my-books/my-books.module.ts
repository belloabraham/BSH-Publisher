import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyBooksRoutingModule } from './my-books-routing.module';
import { MyBooksComponent } from './my-books.component';
import { TranslocoModule } from '@ngneat/transloco';


@NgModule({
  declarations: [
    MyBooksComponent
  ],
  imports: [
    CommonModule,
    MyBooksRoutingModule,
    TranslocoModule,
  ]
})
export class MyBooksModule { }
