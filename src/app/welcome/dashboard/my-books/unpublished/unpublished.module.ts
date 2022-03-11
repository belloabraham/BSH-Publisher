import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnpublishedRoutingModule } from './unpublished-routing.module';
import { UnpublishedComponent } from './unpublished.component';


@NgModule({
  declarations: [
    UnpublishedComponent
  ],
  imports: [
    CommonModule,
    UnpublishedRoutingModule
  ]
})
export class UnpublishedModule { }
