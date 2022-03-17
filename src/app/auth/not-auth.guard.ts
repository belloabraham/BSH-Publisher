import { Injectable, Optional } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable, } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { Providers } from 'src/domain/data/providers';
import { Route as Routes } from 'src/domain/data/route';

@Injectable({
  providedIn: Providers.any,
})
export class NotAuthGuard implements CanLoad {
  constructor(@Optional() private auth: Auth, private router: Router) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    
    //*If user is authenticated
    if (this.auth.currentUser) {
      this.router.navigateByUrl(Routes.welcome);
      return false;
    }

    return true;
  }
}
