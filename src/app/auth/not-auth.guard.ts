import { Inject, Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Providers } from 'src/data/providers';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH } from 'src/services/authentication/user-auth.token';
import { Route as Routes } from 'src/data/route';


@Injectable({
  providedIn: Providers.any,
})
export class NotAuthGuard implements CanLoad {

  constructor(
    @Inject(USER_AUTH) private userAuth: IUserAuth,
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
    
    //*If user is authenticated
    if (this.userAuth.getPubId()) {
      console.log(this.userAuth.getPubId())
      this.router.navigateByUrl(Routes.welcome);
      return false
    } 
    
      return true;
  }
}
