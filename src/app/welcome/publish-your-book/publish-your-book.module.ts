import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublishYourBookRoutingModule } from './publish-your-book-routing.module';
import { PublishYourBookComponent } from './publish-your-book.component';


@NgModule({
  declarations: [
    PublishYourBookComponent
  ],
  imports: [
    CommonModule,
    PublishYourBookRoutingModule
  ]
})
export class PublishYourBookModule { }
