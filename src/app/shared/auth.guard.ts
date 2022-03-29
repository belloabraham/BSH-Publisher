import { Injectable, Optional } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { Auth, authState } from '@angular/fire/auth';
import { Providers } from 'src/domain/data/providers';
import { Route as Routes } from 'src/domain/data/route';
import { Logger } from 'src/helpers/utils/logger';

@Injectable({
  providedIn: Providers.ANY,
})
export class AuthGuard implements CanLoad {

  private allowAccessToRoute = true

  constructor(private router: Router, @Optional() private auth: Auth) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    
    return authState(this.auth).pipe(
      map((isAuthenticatedUser) => {
        if (isAuthenticatedUser) {
          return this.allowAccessToRoute;
        } else {
          return this.navigateHome();
        }
      }),
      catchError((error) => {
        //*Can't tell if the user is authenticated or not
        Logger.error(this, this.canLoad.name, error.message);
        return of(this.navigateHome())
      })
    );
  }

  private navigateHome() {
     this.router.navigateByUrl(Routes.root);
     return false;
  }
}
