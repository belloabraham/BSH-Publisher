import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Providers } from 'src/domain/data/providers';
import { Route as Routes } from 'src/domain/data/route';
import { IPublisher } from 'src/domain/models/entities/ipublisher';
import { Logger } from 'src/helpers/utils/logger';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { ErrorService } from '../error/error.service';
import { IDatabase } from 'src/domain/data/remote-data-source/idatabase';
import { DATABASE_IJTOKEN } from 'src/domain/data/remote-data-source/database.token';
import { Collection } from 'src/domain/data/remote-data-source/collection';

@Injectable({
  providedIn: Providers.ANY,
})
export class NoPublisherDataGuard implements CanActivate {
  
  constructor(
    @Inject(DATABASE_IJTOKEN) private remoteData: IDatabase,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private router: Router,
    private errorService: ErrorService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const pubId = this.userAuth.getPubId()!;

    return this.remoteData
      .getDocData<IPublisher>(Collection.PUBLISHERS, [pubId])
      .then((pubDataExist) => {
        if (pubDataExist) {
          this.router.navigateByUrl(Routes.WELCOME);
          return false;
        }
        return true;
      })
      .catch((error) => {
        Logger.error(this, this.canActivate.name, error.message);
        this.errorService.errorRoute = [Routes.SIGN_UP];
        this.router.navigateByUrl(Routes.ERROR);
        return false;
      });
  }
}
