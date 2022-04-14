import { Inject, Injectable } from '@angular/core';
import { where } from '@angular/fire/firestore';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { ErrorService } from 'src/app/error/error.service';
import { IEarnings } from 'src/data/models/entities/iearnings';
import { Providers } from 'src/data/providers';
import { Collection } from 'src/data/remote-data-source/collection';
import { DATABASE_IJTOKEN } from 'src/data/remote-data-source/database.token';
import { Fields } from 'src/data/remote-data-source/fields';
import { IDatabase } from 'src/data/remote-data-source/idatabase';
import { Route } from 'src/data/route';
import { Logger } from 'src/helpers/utils/logger';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';

@Injectable({
  providedIn: Providers.ANY,
})
export class EarningsResolver implements Resolve<IEarnings[] | null> {
  constructor(
    private router: Router,
    private errorService: ErrorService,
    @Inject(DATABASE_IJTOKEN) private remoteData: IDatabase,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<IEarnings[] | null> {
    try {
      const pubId = this.userAuth.getPubId()!;
      const earnings = await this.remoteData.getArrayOfDocDataWhere<IEarnings>(
        Collection.EARNINGS,
        [],
        [where(Fields.pubId, '==', pubId)]
      );

      const isEarnings = earnings.length > 0;
      if (!isEarnings) {
        return null;
      }

      return earnings;
    } catch (error) {
      Logger.error('EarningsResolver', this.resolve.name, error);
      this.errorService.errorRoute = [
        Route.WELCOME,
        Route.DASHBOARD,
        Route.PAYMENT,
        Route.EARNINGS,
      ];
      this.router.navigateByUrl(Route.ERROR);
      return null;
    }
  }
}
