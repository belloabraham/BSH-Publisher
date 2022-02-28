import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from 'src/guards/can-deactivate.guard';
import { CompleteSignUpComponent } from './complete-sign-up.component';

const routes: Routes = [
  {
    path: '',
    canDeactivate:[CanDeactivateGuard],
    component: CompleteSignUpComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompleteSignUpRoutingModule { }
