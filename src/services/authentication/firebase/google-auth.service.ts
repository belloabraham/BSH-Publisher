import { Injectable, Optional } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithRedirect,
} from '@angular/fire/auth';
import { Providers } from 'src/domain/data/providers';

@Injectable({
  providedIn: Providers.ROOT,
})
export class GoogleAuthService {
  
  constructor(@Optional() private auth: Auth) {}

  signInWithGoogleRedirect():Promise<never> {
    return signInWithRedirect(this.auth, new GoogleAuthProvider())
  }
  
}

