import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyStoreComponent } from './empty-store.component';

const routes: Routes = [
  { path: '', component: EmptyStoreComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmptyStoreRoutingModule {}
