import {Inject, Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { IPaymentRequest } from 'src/data/models/entities/ipayment-request';
import { Providers } from 'src/data/providers';
import { Collection } from 'src/data/remote-data-source/collection';
import { DATABASE_IJTOKEN } from 'src/data/remote-data-source/database.token';
import { IDatabase } from 'src/data/remote-data-source/idatabase';

@Injectable({
  providedIn: Providers.ANY,
})
export class PaymentRequestResolver
  implements Resolve<IPaymentRequest[] | null>
{
  constructor(@Inject(DATABASE_IJTOKEN) private remoteData: IDatabase) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<IPaymentRequest[] | null> {
    return this.remoteData.getArrayOfDocData<IPaymentRequest>(
      Collection.PAYMENT_REQUEST,
      []
    );
  }
}
