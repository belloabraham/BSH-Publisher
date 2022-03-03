import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmptyStoreRoutingModule } from './empty-store-routing.module';
import { EmptyStoreComponent } from './empty-store.component';
import { TranslocoModule } from '@ngneat/transloco';


@NgModule({
  declarations: [
    EmptyStoreComponent
  ],
  imports: [
    CommonModule,
    EmptyStoreRoutingModule,
    TranslocoModule
  ]
})
export class EmptyStoreModule { }
