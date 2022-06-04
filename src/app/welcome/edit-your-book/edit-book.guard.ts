import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Providers } from 'src/data/providers';
import { Route as Routes } from 'src/data/route';
import { RouteDataVewModel } from '../route-data.viewmodel';

@Injectable({
  providedIn: Providers.ANY,
})
export class EditBookGuard implements CanLoad {
  constructor(
    private routeData: RouteDataVewModel,
    private router: Router) { }


  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.routeData.bookIdToEdit) {
      return true;
    } else {
      this.router.navigate([Routes.ROOT, Routes.WELCOME]);
      return false;
    }
  }
}
