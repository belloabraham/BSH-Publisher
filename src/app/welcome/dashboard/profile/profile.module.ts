import { NgModule } from '@angular/core';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { UserDataFormModule } from 'src/app/shared/user-data-form/user-data-form.module';
import { LyExpansionModule } from '@alyle/ui/expansion';
import { LyButtonModule } from '@alyle/ui/button';
import { provideFunctions } from '@angular/fire/functions';
import { getFunctions } from 'firebase/functions';
import { CloudFunctions } from 'src/services/function/cloud-functions';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    ProfileRoutingModule,
    UserDataFormModule,
    LyExpansionModule,
    LyButtonModule,
    provideFunctions(() => getFunctions(undefined, CloudFunctions.location)),
  ],
})
export class ProfileModule {}
