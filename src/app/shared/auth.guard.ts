import { Injectable, Optional } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { delay, Observable, of } from 'rxjs';
import { Providers } from 'src/data/providers';
import { Route as Routes } from 'src/data/route';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: Providers.any,
})
export class AuthGuard implements CanLoad {
  constructor(private router: Router, @Optional() private auth: Auth) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true
    if (this.auth.currentUser) {
      return true;
    } else {
      this.router.navigateByUrl(Routes.root);
      return false;
    }
  }
}
