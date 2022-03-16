import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyBookStoreComponent } from './empty-book-store.component';

const routes: Routes = [{ path: '', component: EmptyBookStoreComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmptyBookStoreRoutingModule { }
