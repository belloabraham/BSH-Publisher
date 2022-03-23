import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/shared/can-deactivate.guard';
import { DetailsComponent } from './details.component';

const routes: Routes = [
  {
    path: '',
    canDeactivate: [CanDeactivateGuard],
    component: DetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsRoutingModule {}
