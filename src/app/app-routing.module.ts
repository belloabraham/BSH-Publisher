import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/data/route';
import { NotAuthGuard } from './auth/not-auth.guard';
import { AuthGuard } from './shared/auth.guard';
import { NoPublisherDataGuard } from './sign-up/no-publisher-data.guard';
import { VerifyEmailGuard } from './verify-email/verify-email.guard';
import { PubDataResolver } from './welcome/pub-data.resolver';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canLoad: [NotAuthGuard],
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: Route.WELCOME,
    canLoad: [AuthGuard],
    resolve: { pubData: PubDataResolver },
    loadChildren: () =>
      import('./welcome/welcome.module').then((m) => m.WelcomeModule),
  },
  {
    path: Route.VERIFY_EMAIL,
    canLoad: [VerifyEmailGuard],
    loadChildren: () =>
      import('./verify-email/verify-email.module').then(
        (m) => m.VerifyEmailModule
      ),
  },
  {
    path: Route.SIGN_UP,
    canLoad: [AuthGuard],
    canActivate:[NoPublisherDataGuard],
    loadChildren: () =>
      import('./sign-up/sign-up.module').then((m) => m.SignUpModule),
  },
  {
    path: Route.ERROR,
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
