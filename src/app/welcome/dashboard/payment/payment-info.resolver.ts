import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Providers } from 'src/data/providers';

@Injectable({
  providedIn: Providers.any
})
export class PaymentInfoResolver implements Resolve<boolean> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    //*If error navigate to error page passing route and error message
    return of(true);
  }
}
