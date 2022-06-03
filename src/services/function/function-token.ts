import { inject, InjectionToken } from '@angular/core';
import { Functions } from '@angular/fire/functions';
import { Providers } from 'src/data/providers';
import { CloudFunctionService } from './firebase/cloud-function.service';
import { ICloudFunctions } from './icloud-function';

export const CLOUD_FUNCTIONS = new InjectionToken<ICloudFunctions>('cloud-funtions');
