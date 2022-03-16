import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublishYourBookComponent } from './publish-your-book.component';

const routes: Routes = [{ path: '', component: PublishYourBookComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishYourBookRoutingModule { }
