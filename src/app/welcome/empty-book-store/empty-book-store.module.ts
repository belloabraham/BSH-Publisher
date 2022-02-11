import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmptyBookStoreRoutingModule } from './empty-book-store-routing.module';
import { EmptyBookStoreComponent } from './empty-book-store.component';
import { TranslocoModule } from '@ngneat/transloco';


@NgModule({
  declarations: [
    EmptyBookStoreComponent
  ],
  imports: [
    CommonModule,
    EmptyBookStoreRoutingModule,
    TranslocoModule
  ]
})
export class EmptyBookStoreModule { }
