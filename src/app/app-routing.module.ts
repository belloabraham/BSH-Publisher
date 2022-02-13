import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/data/route';
import { VerifyEmailGuard } from './verify-email/verify-email.guard';
import { AuthGuard } from './welcome/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: Route.auth, pathMatch: 'full' },
  {
    path: Route.auth,
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: Route.welcome,
    canLoad:[AuthGuard],
    loadChildren: () =>
      import('./welcome/welcome.module').then((m) => m.WelcomeModule),
  },
  {
    path: Route.verifyEmail,
    canLoad:[VerifyEmailGuard],
    loadChildren: () =>
      import('./verify-email/verify-email.module').then(
        (m) => m.VerifyEmailModule
      ),
  },
  {
    path: Route.notfound,
    loadChildren: () =>
      import('./404/not-found.module').then((m) => m.NotFoundModule),
  },
  { path: '**', redirectTo: Route.notfound },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
