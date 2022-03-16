import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from 'src/guards/can-deactivate.guard';
import { SignUpComponent } from './sign-up.component';

const routes: Routes = [
  {
    path: '',
    canDeactivate: [CanDeactivateGuard],
    component: SignUpComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignUpRoutingModule { }
