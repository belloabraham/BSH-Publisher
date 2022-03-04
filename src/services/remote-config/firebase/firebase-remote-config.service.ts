import { Injectable, isDevMode, Optional } from '@angular/core';
import { IRemoteConfig } from '../i-remote-config';
import {
  fetchAndActivate,
  getValue,
  RemoteConfig,
} from '@angular/fire/remote-config';


@Injectable()
export class FirebaseRemoteConfigService implements IRemoteConfig {
  constructor(@Optional() private remoteConfig: RemoteConfig) {

     if (remoteConfig) {
       if (isDevMode()) {
         remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
       }

       remoteConfig.defaultConfig = {
         publishers_feedback_link: 'https://forms.gle/CQ7K1iSTQxFw5Un86',
         publishers_help_link: 'https://www.bookshelfhub.com/help',
       };

       fetchAndActivate(remoteConfig);
     }

  }

  getString(key: string): string {
    return getValue(this.remoteConfig, key).asString();
  }
}
