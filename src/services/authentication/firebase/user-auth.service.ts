import { Injectable, Optional } from '@angular/core';
import { Providers } from 'src/data/providers';
import { Auth, authState, signOut, UserCredential } from '@angular/fire/auth';
import { GoogleAuthService } from './google-auth.service';
import { EmailAuthService } from './email-auth.service';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { StringResKeys } from '../locale/string-res-keys';
import { ErrorCodes } from './error-codes';
import { IUserAuth } from '../iuser-auth';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: Providers.root,
})
export class UserAuthService implements IUserAuth {
  constructor(
    private googleAuth: GoogleAuthService,
    private emailAuth: EmailAuthService,
    @Optional() private auth: Auth,
    private localeService: LocaleService
  ) {}

  signInWithEmailLink(
    email: string,
    emailLink: string
  ): Promise<UserCredential> {
    return this.emailAuth.signInWithEmailLink(email, emailLink);
  }

  sendSignInLinkToEmail(email: string): Promise<void> {
    return this.emailAuth.sendSignInLinkToEmail(email);
  }

  signInWithGoogleRedirect(): Promise<never> {
    return this.googleAuth.signInWithGoogleRedirect();
  }

  isSignInWithEmailLink(emailLink: string): boolean {
    return this.emailAuth.isSignInWithEmailLink(emailLink);
  }

  signOut(): Promise<void> {
    return signOut(this.auth);
  }

  getPubId(): string | null {
    const user = this.auth.currentUser;
    return user === null ? null : user.uid;
  }

  getEmail(): string | null {
    const user = this.auth.currentUser;
    return user === null ? null : user.email;
  }

  authState():Observable<boolean> {
    return authState(this.auth).pipe(
      map((user) => {
        if (user) {
          return true;
        } else {
          return false;
        }
      })
    );
  }

  getErrorMessage(authError: any): string {
    const errorCode = authError.code;
    switch (errorCode) {
      case ErrorCodes.networkReqFailed:
        return this.localeService.paramTranslate(StringResKeys.networkError, {
          value: errorCode,
        });
      case ErrorCodes.argumentError:
        return this.localeService.paramTranslate(
          StringResKeys.invalidEmailError,
          {
            value: errorCode,
          }
        );
      default:
        return authError.message;
    }
  }
}
