import { inject, InjectionToken } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { Providers } from "src/data/providers";
import { LocaleService } from "src/helpers/transloco/locale.service";
import { EmailAuthService } from "./firebase/email-auth.service";
import { GoogleAuthService } from "./firebase/google-auth.service";
import { UserAuthService } from "./firebase/user-auth.service";
import { IUserAuth } from "./iuser-auth";



export const USER_AUTH = new InjectionToken<IUserAuth>('user-auths', {
  providedIn: Providers.root,
  factory: () =>
    new UserAuthService(
      inject(GoogleAuthService),
      inject(EmailAuthService),
      inject(Auth),
      inject(LocaleService)
    ),
});
