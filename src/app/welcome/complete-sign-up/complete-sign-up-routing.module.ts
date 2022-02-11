import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompleteSignUpComponent } from './complete-sign-up.component';

const routes: Routes = [{ path: '', component: CompleteSignUpComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompleteSignUpRoutingModule { }
