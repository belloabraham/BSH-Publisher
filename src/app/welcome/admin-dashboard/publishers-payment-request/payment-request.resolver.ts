import { Inject, Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { ErrorService } from 'src/app/error/error.service';
import { IPaymentRequest } from 'src/data/models/entities/ipayment-request';
import { Providers } from 'src/data/providers';
import { Collection } from 'src/data/remote-data-source/collection';
import { DATABASE_IJTOKEN } from 'src/data/remote-data-source/database.token';
import { IDatabase } from 'src/data/remote-data-source/idatabase';
import { Route } from 'src/data/route';
import { Logger } from 'src/helpers/utils/logger';

@Injectable({
  providedIn: Providers.ANY,
})
export class PaymentRequestResolver
  implements Resolve<IPaymentRequest[] | null>
{
  constructor(
    @Inject(DATABASE_IJTOKEN) private remoteData: IDatabase,
    private errorService: ErrorService,
    private router: Router
  ) {}

 async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<IPaymentRequest[] | null> {

    try {
      return await this.remoteData.getArrayOfDocData<IPaymentRequest>(
        Collection.PAYMENT_REQUEST,
        []
      );
    } catch (error) {
       Logger.error('PaymentRequestResolver', this.resolve.name, error);
      this.errorService.errorRoute = [Route.WELCOME, Route.ADMIN, Route.PAYMENT_REQUEST];
      this.router.navigateByUrl(Route.ERROR);
      return null;
    }

  }
}
