import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollaborationsResolver } from 'src/app/shared/collaborations/collaborations.resolver';
import { Route } from 'src/data/route';
import { CollaboratorCollaborationsComponent } from './collaborator-collaborations.component';

const routes: Routes = [
  {
    path: '',
    component: CollaboratorCollaborationsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: Route.COLLABORATIONS,
      },
      {
        path: Route.COLLABORATIONS,
        resolve: { collaborations: CollaborationsResolver },
        loadChildren: () =>
          import('../../shared/collaborations/collaborations.module').then(
            (m) => m.CollaborationsModule
          ),
      },
      {
        path: Route.PAYMENT,
        loadChildren: () =>
          import('./payment/payment.module').then((m) => m.PaymentModule),
      },
      {
        path: Route.PROFILE,
        loadChildren: () =>
          import('../dashboard/profile/profile.module').then(
            (m) => m.ProfileModule
          ),
      },
    ],
  },
  {
    path: 'welcome/collaborator-collaborations/pament',
    loadChildren: () =>
      import('./payment/payment.module').then((m) => m.PaymentModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollaboratorCollaborationsRoutingModule { }
