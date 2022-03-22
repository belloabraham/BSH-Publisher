import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from './transloco-root.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  provideAnalytics,
  getAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import {
  initializeAppCheck,
  provideAppCheck,
  ReCaptchaV3Provider,
} from '@angular/fire/app-check';
import { environment } from 'src/environments/environment';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  LY_THEME,
  LY_THEME_NAME,
  StyleRenderer,
  LyTheme2,
  LY_THEME_GLOBAL_VARIABLES,
} from '@alyle/ui';
import { MinimaLight } from '@alyle/ui/themes/minima';

import { AlyleGlobalThemeVariables } from 'src/theme/alyle-global-theme-variables';
import { AlyleLightThemeVariables } from 'src/theme/alyle-light-theme-variables';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslocoRootModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideAppCheck(() =>
      initializeAppCheck(undefined, {
        provider: new ReCaptchaV3Provider(environment.reCAPTCHA3SiteKey),
        isTokenAutoRefreshEnabled: true,
      })
    ),
    BrowserAnimationsModule,
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    StyleRenderer,
    LyTheme2,
    { provide: LY_THEME_NAME, useValue: 'minima-light' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true },
    { provide: LY_THEME, useClass: AlyleLightThemeVariables, multi: true },
    { provide: LY_THEME_GLOBAL_VARIABLES, useClass: AlyleGlobalThemeVariables }, // global variables
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
