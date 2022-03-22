import { Inject, Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Providers } from 'src/domain/data/providers';
import { DATABASE_IJTOKEN } from 'src/domain/remote-data-source/database.token';
import { IDatabase } from 'src/domain/remote-data-source/idatabase';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';

@Injectable({
  providedIn: Providers.any,
})
export class PubDataGuard implements CanLoad {
  
  constructor(
    @Inject(DATABASE_IJTOKEN) private remoteData: IDatabase,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth
  ) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    
    
    
    //*If find data save it to user data view model
    //*If error navigate to error page passing route and error message
    return true;
  }
}
