import { NgModule } from '@angular/core';

import { CompleteSignUpRoutingModule } from './complete-sign-up-routing.module';
import { CompleteSignUpComponent } from './complete-sign-up.component';
import { UserDataFormModule } from 'src/app/shared/user-data-form/user-data-form.module';
@NgModule({
  declarations: [CompleteSignUpComponent],
  imports: [
    CompleteSignUpRoutingModule,
    UserDataFormModule
  ],
})
export class CompleteSignUpModule {}
