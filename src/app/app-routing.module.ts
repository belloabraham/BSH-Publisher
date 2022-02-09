import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'src/data/route';

const routes: Routes = [
  { path: '', redirectTo: Route.auth, pathMatch: 'full' },
  { path: '**', redirectTo: Route.notfound },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
