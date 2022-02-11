import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/data/route';

const routes: Routes = [
  { path: '', redirectTo: Route.auth, pathMatch: 'full' },
  {
    path: Route.auth,
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: Route.notfound,
    loadChildren: () =>
      import('./404/not-found.module').then((m) => m.NotFoundModule),
  },
  { path: 'verify-email', loadChildren: () => import('./verify-email/verify-email.module').then(m => m.VerifyEmailModule) },
  { path: 'welcome', loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: '**', redirectTo: Route.notfound },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
