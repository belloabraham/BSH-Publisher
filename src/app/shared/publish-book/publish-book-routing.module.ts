import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublishBookComponent } from './publish-book.component';

const routes: Routes = [{ path: '', component: PublishBookComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishBookRoutingModule { }
