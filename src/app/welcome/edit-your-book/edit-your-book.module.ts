import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditYourBookRoutingModule } from './edit-your-book-routing.module';
import { EditYourBookComponent } from './edit-your-book.component';


@NgModule({
  declarations: [
    EditYourBookComponent
  ],
  imports: [
    CommonModule,
    EditYourBookRoutingModule
  ]
})
export class EditYourBookModule { }
