import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollaborationsRoutingModule } from './collaborations-routing.module';
import { CollaborationsComponent } from './collaborations.component';
import { TranslocoModule } from '@ngneat/transloco';


@NgModule({
  declarations: [
    CollaborationsComponent
  ],
  imports: [
    CommonModule,
    CollaborationsRoutingModule,
    TranslocoModule
  ],
  exports: [
    CollaborationsComponent,
    TranslocoModule
  ]
})
export class CollaborationsModule { }
