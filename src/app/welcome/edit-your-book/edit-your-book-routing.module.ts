import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditYourBookComponent } from './edit-your-book.component';

const routes: Routes = [{ path: '', component: EditYourBookComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditYourBookRoutingModule { }
