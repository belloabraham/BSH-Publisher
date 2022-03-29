import { UserCredential } from "@angular/fire/auth";
import { Observable } from "rxjs";

export interface IUserAuth {
  sendSignInLinkToEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogleRedirect: () => Promise<never>;
  getErrorMessage: (authError: any) => string;
  getPubId: () => string | null;
  getEmail: () => string | null;
  isSignInWithEmailLink: (emailLink: string) => boolean;
  signInWithEmailLink: (
    email: string,
    emailLink: string
  ) => Promise<UserCredential>;
}
