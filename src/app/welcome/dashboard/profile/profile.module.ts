import { NgModule } from '@angular/core';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { UserDataFormModule } from 'src/app/shared/user-data-form/user-data-form.module';
import { LyExpansionModule } from '@alyle/ui/expansion';
import { LyButtonModule } from '@alyle/ui/button';
import { LyTooltipModule } from '@alyle/ui/tooltip';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    ProfileRoutingModule,
    UserDataFormModule,
    LyExpansionModule,
    LyButtonModule,
    LyTooltipModule,
    ClipboardModule,
  ],
})
export class ProfileModule {}
