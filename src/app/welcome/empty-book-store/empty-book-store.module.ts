import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmptyBookStoreRoutingModule } from './empty-book-store-routing.module';
import { EmptyBookStoreComponent } from './empty-book-store.component';
import { TranslocoModule } from '@ngneat/transloco';
import { LyButtonModule } from '@alyle/ui/button';

@NgModule({
  declarations: [
    EmptyBookStoreComponent
  ],
  imports: [
    CommonModule,
    EmptyBookStoreRoutingModule,
    TranslocoModule,
    LyButtonModule
  ]
})
export class EmptyBookStoreModule { }
