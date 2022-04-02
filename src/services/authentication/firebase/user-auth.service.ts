import { Injectable, Optional } from '@angular/core';
import { Auth, signOut, UserCredential } from '@angular/fire/auth';
import { GoogleAuthService } from './google-auth.service';
import { EmailAuthService } from './email-auth.service';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { StringResKeys } from '../locale/string-res-keys';
import { ErrorCodes } from './error-codes';
import { IUserAuth } from '../iuser-auth';

@Injectable()
export class UserAuthService implements IUserAuth {
  
  constructor(
    private googleAuth: GoogleAuthService,
    private emailAuth: EmailAuthService,
    @Optional() private auth: Auth,
    private localeService: LocaleService,
  ) {
  }

  signInWithEmailLink(
    email: string,
    emailLink: string
  ): Promise<UserCredential> {
    return this.emailAuth.signInWithEmailLink(email, emailLink);
  }

  sendSignInLinkToEmail(email: string): Promise<void> {
    return this.emailAuth.sendSignInLinkToEmail(email);
  }

  signInWithGoogleRedirect():Promise<never> {
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
    return user ? user.uid : null;
  }

  getEmail(): string | null {
    const user = this.auth.currentUser;
    return user ? user.email : null;
  }

  getErrorMessage(authError: any): string {
    const errorCode = authError.code;
    switch (errorCode) {
      case ErrorCodes.networkReqFailed:
        return this.localeService.paramTranslate(StringResKeys.networkError, {
          value: '',
        });
      case ErrorCodes.argumentError:
        return this.localeService.paramTranslate(
          StringResKeys.invalidEmailError,
          {
            value: '',
          }
        );
      default:
        return authError.message;
    }
  }
}
