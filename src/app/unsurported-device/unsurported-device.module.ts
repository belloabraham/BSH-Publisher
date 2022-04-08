import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnsurportedDeviceRoutingModule } from './unsurported-device-routing.module';
import { UnsurportedDeviceComponent } from './unsurported-device.component';
import { TranslocoModule } from '@ngneat/transloco';


@NgModule({
  declarations: [
    UnsurportedDeviceComponent
  ],
  imports: [
    CommonModule,
    UnsurportedDeviceRoutingModule,
    TranslocoModule
  ]
})
export class UnsurportedDeviceModule { }
