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


@NgModule({
  declarations: [DashboardComponent, NotificationComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    TranslocoModule,
    LyButtonModule,
    LyTooltipModule,
    provideRemoteConfig(() => getRemoteConfig()),
  ],
})
export class DashboardModule {}
