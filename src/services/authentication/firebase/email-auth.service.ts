import { Injectable, Optional } from '@angular/core';
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  Auth,
  UserCredential,
} from '@angular/fire/auth';
import { Config } from 'src/domain/data/config';
import { Providers } from 'src/domain/data/providers';


@Injectable({
  providedIn: Providers.root,
})
export class EmailAuthService {
  constructor(@Optional() private auth: Auth) {}

  
  isSignInWithEmailLink(emailLink: string): boolean {
    return isSignInWithEmailLink(this.auth, emailLink);
  }

  signInWithEmailLink(email: string, emailLink: string):Promise<UserCredential> {
    return signInWithEmailLink(this.auth, email, emailLink);
  }

  sendSignInLinkToEmail(email: string):Promise<void> {
    const actionCodeSettings = {
      url: Config.emailSignInRedirectURI,
      handleCodeInApp: true,
    };
    return sendSignInLinkToEmail(this.auth, email, actionCodeSettings);
  }
}
