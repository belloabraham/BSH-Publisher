import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import {
  initializeAppCheck,
  provideAppCheck,
  ReCaptchaV3Provider,
} from '@angular/fire/app-check';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [WelcomeComponent],
  imports: [
    CommonModule,
    WelcomeRoutingModule,
    provideFirestore(() => getFirestore()),
    provideAppCheck(() =>
      initializeAppCheck(undefined, {
        provider: new ReCaptchaV3Provider(environment.reCAPTCHA3SiteKey),
        isTokenAutoRefreshEnabled: true,
      })
    ),
  ],
})
export class WelcomeModule {}
