import { Inject, Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { ErrorService } from 'src/app/error/error.service';
import { Providers } from 'src/domain/data/providers';
import { Collection } from 'src/domain/data/remote-data-source/collection';
import { DATABASE_IJTOKEN } from 'src/domain/data/remote-data-source/database.token';
import { IDatabase } from 'src/domain/data/remote-data-source/idatabase';
import { Route } from 'src/domain/data/route';
import { IPaymentDetails } from 'src/domain/models/entities/ipayment-details';
import { Logger } from 'src/helpers/utils/logger';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';

@Injectable({
  providedIn: Providers.ANY,
})
export class PaymentInfoResolver implements Resolve<IPaymentDetails | null> {
  
  constructor(
    @Inject(DATABASE_IJTOKEN) private remoteData: IDatabase,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private router: Router,
    private errorService: ErrorService
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<IPaymentDetails | null> {
    const pubId = this.userAuth.getPubId()!;
    try {
      const paymentDetails = await this.remoteData.getDocData<IPaymentDetails>(
        Collection.PAYMENT_DETAILS,
        [pubId]
      );
      return paymentDetails;
    } catch (error: any) {
      Logger.error(this, this.resolve.name, error.message);
      this.errorService.errorRoute = [
        Route.WELCOME,
        Route.DASHBOARD,
        Route.PAYMENT
      ];
      this.router.navigateByUrl(Route.ERROR);
      return null;
    }
  }
}
