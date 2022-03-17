import { Injectable, Optional } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { Providers } from 'src/domain/data/providers';
import { Route as Routes } from 'src/domain/data/route';

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
