import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/data/route';

const routes: Routes = [
  { path: '', redirectTo: Route.auth, pathMatch: 'full' },
  { path: Route.notfound, loadChildren: () => import('./404/not-found.module').then(m => m.NotFoundModule) },
  { path: Route.auth, loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: '**', redirectTo: Route.notfound },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
