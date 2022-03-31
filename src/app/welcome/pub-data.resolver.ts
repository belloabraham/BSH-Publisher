import { Inject, Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { Providers } from 'src/domain/data/providers';
import { Collection } from 'src/domain/data/remote-data-source/collection';
import { DATABASE_IJTOKEN } from 'src/domain/data/remote-data-source/database.token';
import { IDatabase } from 'src/domain/data/remote-data-source/idatabase';
import { Route } from 'src/domain/data/route';
import { IPublisher } from 'src/domain/models/entities/ipublisher';
import { Logger } from 'src/helpers/utils/logger';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { ErrorService } from '../error/error.service';

@Injectable({
  providedIn: Providers.ANY,
})
export class PubDataResolver implements Resolve<IPublisher | null> {
  constructor(
    @Inject(DATABASE_IJTOKEN) private remoteData: IDatabase,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private router: Router,
    private errorService: ErrorService
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<IPublisher | null> {
    try {
      const pubId = this.userAuth.getPubId()!;
      const pubData = await this.remoteData.getDocData<IPublisher>(
        Collection.publishers,
        [pubId]
      );
      if (pubData === null) {
        this.router.navigateByUrl(Route.SIGN_UP);
      }
      return pubData;
    } catch (error: any) {
      Logger.error(this, this.resolve.name, error.message);
      this.errorService.errorRoute = [Route.welcome];
      this.router.navigateByUrl(Route.ERROR);
      return null;
    }
  }
}
