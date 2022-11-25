import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { IPaymentRequest } from 'src/data/models/entities/ipayment-request';
import { Providers } from 'src/data/providers';

@Injectable({
  providedIn: Providers.ANY
})
export class PaymentRequestResolver implements Resolve<IPaymentRequest[] | null> {

  constructor(){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<IPaymentRequest[] | null> {
    return of(true);
  }
}
