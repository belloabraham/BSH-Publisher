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

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    TranslocoModule,
    LyButtonModule,
    provideRemoteConfig(() => getRemoteConfig()),
  ],
})
export class DashboardModule {}
