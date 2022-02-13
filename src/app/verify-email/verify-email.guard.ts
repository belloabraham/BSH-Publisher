import { Inject, Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Providers } from 'src/data/providers';
import { Route as Routes} from 'src/data/route';
import { Settings } from 'src/data/settings';
import { Logger } from 'src/helpers/utils/logger';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH } from 'src/services/authentication/user-auth.token';

@Injectable({
  providedIn: Providers.any,
})
export class VerifyEmailGuard implements CanLoad {
  private userEmail = localStorage.getItem(Settings.userEmail);

  constructor(@Inject(USER_AUTH) private userAuth: IUserAuth,  private router: Router) {}

   canLoad(
     route: Route,
     segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    
     //*Check if user is autheneticated on the device already
    if (this.userAuth.getPubId()) {
      this.router.navigateByUrl(Routes.welcome);
      return false
    } else if (this.userEmail) {//*check if the user sign in with mail on this device
      return this.verifyEmailWithLink(this.userEmail);
    } else {
      //*Allow navigation to verify email component
      return true;
    }
  }

  private async verifyEmailWithLink(email: string):Promise<boolean> {
   return  this.userAuth.signInWithEmailLink(email, location.href)
      .then(() => {
        this.userAuth.signInWithEmailLink(email, location.href);
        localStorage.removeItem(Settings.userEmail);
      this.router.navigateByUrl(Routes.welcome);
      return false
      })
      .catch(error => {
        Logger.error('VerifyEmailGuard', 'verifyEmailWithLink', error);
        return true;
    })
  }
}