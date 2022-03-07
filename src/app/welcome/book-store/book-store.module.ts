import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookStoreRoutingModule } from './book-store-routing.module';
import { BookStoreComponent } from './book-store.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BookStoreComponent,
  ],
  imports: [
    CommonModule,
    BookStoreRoutingModule,
    ReactiveFormsModule
  ]
})
export class BookStoreModule { }
