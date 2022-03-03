import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookStoreRoutingModule } from './book-store-routing.module';
import { BookStoreComponent } from './book-store.component';


@NgModule({
  declarations: [
    BookStoreComponent
  ],
  imports: [
    CommonModule,
    BookStoreRoutingModule
  ]
})
export class BookStoreModule { }
