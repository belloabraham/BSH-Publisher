import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmptyBookStoreRoutingModule } from './empty-book-store-routing.module';
import { EmptyBookStoreComponent } from './empty-book-store.component';


@NgModule({
  declarations: [
    EmptyBookStoreComponent
  ],
  imports: [
    CommonModule,
    EmptyBookStoreRoutingModule
  ]
})
export class EmptyBookStoreModule { }
