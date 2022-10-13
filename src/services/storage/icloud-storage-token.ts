import { InjectionToken } from "@angular/core";
import { ICloudStorage } from "./icloud-storage";


export const CLOUD_STORAGE_IJTOKEN = new InjectionToken<ICloudStorage>( 'cloud-storage');
