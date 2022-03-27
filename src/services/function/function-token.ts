import { InjectionToken } from '@angular/core';
import { ICloudFunctions } from './icloud-function';

export const CLOUD_FUNCTIONS = new InjectionToken<ICloudFunctions>(
  'cloud-funtions'
);
