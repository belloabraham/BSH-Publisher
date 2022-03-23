import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/shared/can-deactivate.guard';
import { PublishYourBookComponent } from './publish-your-book.component';

const routes: Routes = [
  {
    path: '',
    canDeactivate:[CanDeactivateGuard],
    component: PublishYourBookComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishYourBookRoutingModule { }
