import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotFoundRoutingModule } from './not-found-routing.module';
import { NotFoundComponent } from './not-found.component';
import { TranslocoModule } from '@ngneat/transloco';


@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    TranslocoModule,
    NotFoundRoutingModule,
  ]
})
export class NotFoundModule { }
