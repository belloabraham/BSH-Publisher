import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublishBookRoutingModule } from './publish-book-routing.module';
import { PublishBookComponent } from './publish-book.component';


@NgModule({
  declarations: [
    PublishBookComponent
  ],
  imports: [
    CommonModule,
    PublishBookRoutingModule
  ]
})
export class PublishBookModule { }
