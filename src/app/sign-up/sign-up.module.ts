import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignUpRoutingModule } from './sign-up-routing.module';
import { SignUpComponent } from './sign-up.component';
import { UserDataFormModule } from 'src/app/shared/user-data-form/user-data-form.module';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [SignUpComponent],
  imports: [
    CommonModule,
    SignUpRoutingModule,
    UserDataFormModule,
    provideFirestore(() => getFirestore()),
  ],
})
export class SignUpModule {}
