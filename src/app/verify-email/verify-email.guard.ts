import { Inject, Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Providers } from 'src/domain/data/providers';
import { Route as Routes } from 'src/domain/data/route';
import { Settings } from 'src/domain/data/settings';
import { Logger } from 'src/helpers/utils/logger';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';

@Injectable({
  providedIn: Providers.ANY,
})
export class VerifyEmailGuard implements CanLoad {
  private userEmail = localStorage.getItem(Settings.USER_EMAIL);

  constructor(
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
    //Check if user is autheneticated on the device already
    if (this.userAuth.getPubId()) {
      this.router.navigateByUrl(Routes.WELCOME);
      return false;
    } else if (this.userEmail) {
      //check if the user sign in with mail on this device
      return this.verifyEmailWithLink(this.userEmail!, route.path!);
    } else {
      //Allow navigation to verify email component for email verification
      return true;
    }
  }

  private async verifyEmailWithLink(
    email: string,
    path: string
  ): Promise<boolean> {
    try {
      await this.userAuth.signInWithEmailLink(email, location.href);
      localStorage.removeItem(Settings.USER_EMAIL);
      this.router.navigateByUrl(Routes.WELCOME);
      return false;
    } catch (error:any) {
      Logger.error(this, this.verifyEmailWithLink.name, error.message);
      return true;
    }
  }
}
