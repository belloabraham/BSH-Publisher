import { Inject, Injectable } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Providers } from 'src/domain/data/providers';
import { Route as Routes } from 'src/domain/data/route';
import { IPublisher } from 'src/domain/models/ipublisher';
import { Collection } from 'src/domain/remote-data-source/collection';
import { DATABASE_IJTOKEN } from 'src/domain/remote-data-source/database.token';
import { IDatabase } from 'src/domain/remote-data-source/idatabase';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';

@Injectable({
  providedIn: Providers.any,
})
export class NoPubDataGuard implements CanLoad {
  constructor(
    @Inject(DATABASE_IJTOKEN) private remoteData: IDatabase,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private router: Router
  ) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    
  
    let pubId = this.userAuth.getPubId()!;
    
    let canLoadRoute = this.remoteData
      .getDocData<IPublisher>(Collection.publishers, [pubId])
      .then((pubData) => {
        return pubData ? false : true;
      })
      .catch((_) => {
        this.router.navigateByUrl(Routes.error);
        return false;
      });

    return canLoadRoute;
  }
}
