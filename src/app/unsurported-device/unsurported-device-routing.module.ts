import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnsurportedDeviceComponent } from './unsurported-device.component';

const routes: Routes = [{ path: '', component: UnsurportedDeviceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnsurportedDeviceRoutingModule { }
