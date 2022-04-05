import { Injectable, Optional } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { Auth, authState } from '@angular/fire/auth';
import { Providers } from 'src/data/providers';
import { Route as Routes } from 'src/data/route';
import { Logger } from 'src/helpers/utils/logger';

@Injectable({
  providedIn: Providers.ANY,
})
export class NotAuthGuard implements CanLoad {
  private allowAccessToRoute = true;

  constructor(@Optional() private auth: Auth, private router: Router) {}

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
          return this.goToWelcomePage();
        } else {
          return this.allowAccessToRoute;
        }
      }),
      catchError((error) => {
        //*Can't tell if the user is authenticated or not
        Logger.error(this, this.canLoad.name, error.message);
        return of(this.allowAccessToRoute);
      })
    );
  }

  goToWelcomePage() {
    this.router.navigateByUrl(Routes.WELCOME);
    return false;
  }
}
