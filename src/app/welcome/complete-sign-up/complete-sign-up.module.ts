import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompleteSignUpRoutingModule } from './complete-sign-up-routing.module';
import { CompleteSignUpComponent } from './complete-sign-up.component';
import { TranslocoModule } from '@ngneat/transloco';
import { ReactiveFormsModule } from '@angular/forms';
import { UserDataComponent } from './user-data/user-data.component';


@NgModule({
  declarations: [CompleteSignUpComponent, UserDataComponent],
  imports: [
    CommonModule,
    CompleteSignUpRoutingModule,
    ReactiveFormsModule,
    TranslocoModule,
  ],
})
export class CompleteSignUpModule {}
