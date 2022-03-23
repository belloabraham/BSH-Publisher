import { Inject, Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { Providers } from 'src/domain/data/providers';
import { Route } from 'src/domain/data/route';
import { IPublisher } from 'src/domain/models/entities/ipublisher';
import { Collection } from 'src/domain/remote-data-source/collection';
import { DATABASE_IJTOKEN } from 'src/domain/remote-data-source/database.token';
import { IDatabase } from 'src/domain/remote-data-source/idatabase';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';

@Injectable({
  providedIn: Providers.any,
})
export class PubDataResolver implements Resolve<IPublisher | null> {
  constructor(
    @Inject(DATABASE_IJTOKEN) private remoteData: IDatabase,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private router: Router
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<IPublisher | null> {

    let pubId = this.userAuth.getPubId()!;

    try {
      const pubData = await this.remoteData.getDocData<IPublisher>(
        Collection.publishers,
        [pubId]
      );
      if (pubData === null) {
        this.router.navigateByUrl(Route.signUp);
      }
      return pubData;
    } catch (error) {
      this.router.navigateByUrl(Route.error);
      return null;
    }

  }
}
