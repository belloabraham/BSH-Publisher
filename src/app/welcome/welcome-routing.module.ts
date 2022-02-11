import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'welcome/complete-sign-up', loadChildren: () => import('./complete-sign-up/complete-sign-up.module').then(m => m.CompleteSignUpModule) },
  { path: 'welcome/empty-book-store', loadChildren: () => import('./empty-book-store/empty-book-store.module').then(m => m.EmptyBookStoreModule) },
  { path: 'welcome/dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule { }
