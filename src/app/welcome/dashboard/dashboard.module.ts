import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { TranslocoModule } from '@ngneat/transloco';
import {
  getRemoteConfig,
  provideRemoteConfig,
} from '@angular/fire/remote-config';
import { LyButtonModule } from '@alyle/ui/button';
import { NotificationComponent } from './notification/notification.component';
import { LyTooltipModule } from '@alyle/ui/tooltip';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { CloudFunctions } from 'src/services/function/cloud-functions';

@NgModule({
  declarations: [DashboardComponent, NotificationComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    TranslocoModule,
    LyButtonModule,
    LyTooltipModule,
    provideRemoteConfig(() => getRemoteConfig()),
    provideFunctions(() => getFunctions(undefined, CloudFunctions.location)),
  ],
})
export class DashboardModule {}
