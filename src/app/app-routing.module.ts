import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/domain/data/route';
import { NotAuthGuard } from './auth/not-auth.guard';
import { AuthGuard } from './shared/auth.guard';
import { NoPubDataGuard } from './sign-up/no-pub-data.guard';
import { VerifyEmailGuard } from './verify-email/verify-email.guard';
import { PubDataGuard } from './welcome/pub-data.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canLoad: [NotAuthGuard],
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: Route.welcome,
    canLoad: [AuthGuard, PubDataGuard],
    loadChildren: () =>
      import('./welcome/welcome.module').then((m) => m.WelcomeModule),
  },
  {
    path: Route.verifyEmail,
    canLoad: [VerifyEmailGuard],
    loadChildren: () =>
      import('./verify-email/verify-email.module').then(
        (m) => m.VerifyEmailModule
      ),
  },
  {
    path: Route.signUp,
    canLoad: [AuthGuard, NoPubDataGuard],
    loadChildren: () =>
      import('./sign-up/sign-up.module').then(
        (m) => m.SignUpModule
      ),
  },
  {
    path: Route.error,
    loadChildren: () =>
      import('./error/error.module').then((m) => m.ErrorModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./404/not-found.module').then((m) => m.NotFoundModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
