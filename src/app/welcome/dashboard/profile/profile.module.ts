import { NgModule } from '@angular/core';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { UserDataFormModule } from 'src/app/shared/user-data-form/user-data-form.module';
@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    ProfileRoutingModule, 
    UserDataFormModule,
  ]
})
export class ProfileModule { }
