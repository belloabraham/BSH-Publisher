import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompleteSignUpRoutingModule } from './complete-sign-up-routing.module';
import { CompleteSignUpComponent } from './complete-sign-up.component';


@NgModule({
  declarations: [
    CompleteSignUpComponent
  ],
  imports: [
    CommonModule,
    CompleteSignUpRoutingModule
  ]
})
export class CompleteSignUpModule { }
