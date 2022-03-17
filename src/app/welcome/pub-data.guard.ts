import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Providers } from 'src/domain/data/providers';

@Injectable({
  providedIn: Providers.any
})
export class PubDataGuard implements CanLoad {
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //*If find data save it to user data view model
      //*If error navigate to error page passing route and error message
      return true;
    }
}
